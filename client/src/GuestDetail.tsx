import React, { Component, MouseEvent, ChangeEvent } from "react";
import { isRecord } from "./record";
import { InvitedGuest, parseGuest } from "./guest";

type GuestDetailProps = {
  /** name of the guest */
  name: string,

  /** Called to go back to GuestList Page */
  onBackClick: () => void
}

// RI: additionalName and additionalDietary exist if and only if additional = 1
type GuestDetailState = {
  /** original details of the guest before making any change */
  originalDetails: InvitedGuest,
  
  /** text in the dietary text box */
  dietary: string,

  /** -1 if not sure about bringing additional, 0 if sure to not bring, 1 if sure to bring */
  additional: -1 | 0 | 1,

  /** text in the additional guest name text box */
  additionalName?: string,

  /** text in the additional dietary text box */
  additionalDietary?: string,
  
  /** Waiting for response from the server */
  loading: boolean,

  /** Message telling whether saving was successful or something went wrong */
  message: string
};

/** UI for viewing and updating a guest's details. */
export class GuestDetail extends Component<GuestDetailProps, GuestDetailState> {

  constructor(props: GuestDetailProps) {
    super(props);

    this.state = {originalDetails: {name: this.props.name, dietary: "", host: "James", 
                  isFamily: false, additional: undefined}, dietary: "", additional: -1, 
                  loading: true, message: ""};
  }

  componentDidMount = (): void => {
    this.doRefreshClick();    
  };

  render = (): JSX.Element => {
    if (this.state.loading === true) {
      return <p>Loading Contents...</p>;
    } else {
      return <div>
              <h1>Guest Details</h1>
              <p>{this.props.name}, guest of {this.state.originalDetails.host}, 
                  {this.state.originalDetails.isFamily ? " family" : " not family"}</p>
              <p>Dietary Restrictions {"('none' if none)"}</p>
              <input id="dietary" type="text" onChange={this.doDietaryChange} 
                value={this.state.dietary}></input>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p>Additional Guest? </p>
                <select name="additional" value={this.state.additional} 
                        style={{ marginLeft: '5px' }} onChange={this.doAdditionalChange}>
                  <option value={-1}>unknown</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </div>
              {this.renderAdditional()}
              <div style={{ margin: "10px" }}>
                <button type="button" onClick={this.doSaveClick}>Save</button>
                <button type="button" onClick={this.props.onBackClick}>Back</button>
                <button type="button" onClick={this.doRefreshClick}>Refresh</button>
              </div>
              {this.renderMessage()}
            </div>;
    }
  };

  // Renders details and inputs for the additional guest
  renderAdditional = (): JSX.Element => {
    if (this.state.additional === 1) {
      const additionalName: undefined | string = this.state.additionalName;
      const additionalDietary: undefined | string = this.state.additionalDietary;
      if (additionalDietary !== undefined && additionalName !== undefined) {
        // Just make typechecker happy
        return <div>
                <label htmlFor="additionalName">Guest Name:</label>
                <input id="additionalName" type="text" value={additionalName}
                        onChange={this.doAdditionalNameChange}></input>
                <p>Guest Dietary Restrictions {"('none' if none)"}</p>
                <input id="additionalDietary" type="text" value={additionalDietary}
                        onChange={this.doAdditionalDietaryChange}></input>
              </div>;
      } else {  // Impossible Case
        return <div>
                <label htmlFor="additionalname">Guest Name:</label>
                <input id="additionalName" type="text" 
                        onChange={this.doAdditionalNameChange}></input>
                <p>Guest Dietary Restrictions {"('none' if none)"}</p>
                <input id="additionalDietary" type="text" 
                        onChange={this.doAdditionalDietaryChange}></input>
              </div>;
      }
    } else {
      return <span></span>;
    }
  };

  // Renders the message. 
  renderMessage = (): JSX.Element => {
    return <p style={{ color: 'red' }}>{this.state.message}</p>
  };

  // Refresh GuestDetail Page, Acccesses /loadGuest server endpoint and receives details 
  // of the indicated guest.
  doRefreshClick = (): void => {
    this.setState({loading: true, message: ""});
    fetch("/api/loadGuest?name=" + encodeURIComponent(this.props.name))
      .then((res) => this.doRefreshResp(res))
      .catch(() => this.doRefreshError("failed to connect to server"));
  };

  // Change the input dietary detail. Clears displayed message.
  doDietaryChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({dietary: evt.target.value, message: ""});
  };

  // Change the input additional name. Clears displayed message.
  doAdditionalNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({additional: 1, additionalName: evt.target.value, message: ""});
  };

  // Change the input additional dietary detail. Clears displayed message.
  doAdditionalDietaryChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({additional: 1, additionalDietary: evt.target.value, message: ""});
  };

  // Change the input additional detail. Clear displayed message if succeeded. Displays Error 
  // message otherwise. Clears the input additional details if choose to not bring or unknown.
  doAdditionalChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    const additional: number = parseFloat(evt.target.value);
    if (additional === 0 || additional === -1) {
      this.setState({additional: additional, message: "", 
                    additionalDietary: undefined, additionalName: undefined});
    } else if (additional === 1) {
      this.setState({additional: additional, message: "", 
                    additionalDietary: "", additionalName: ""});
    } else {
      this.setState({message: "Invalid Additional Guest Option"});
    }
  };

  // Attemps to save the changes made to the details of this guest. Display success message if 
  // succeeded. Displays Error message otherwise. 
  doSaveClick = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    if (this.state.dietary.trim().length === 0) {
      this.setState({message: "guest missing dietary"});
    } else {
      if (this.state.additional === 1) {
        if (this.state.additionalName === undefined || 
            this.state.additionalName.trim().length === 0) {
          this.setState({message: "additional guest missing a name"});
        } else if (this.state.additionalDietary === undefined || 
                   this.state.additionalDietary.trim().length === 0) {
          this.setState({message: "additional guest missing dietary"});
        } else {
          fetch("/api/updateGuest", {
            method: "POST", body: JSON.stringify({
              name: this.props.name, 
              dietary: this.state.dietary, 
              additional: true,
              additionalName: this.state.additionalName,
              additionalDietary: this.state.additionalDietary
            }),
            headers: {"Content-Type": "application/json"}})
            .then((res) => this.doSaveResp(res))
            .catch(() => this.doSaveError("failed to connect to server"));
        }
      } else {
        fetch("/api/updateGuest", {
          method: "POST", body: JSON.stringify({
            name: this.props.name, 
            dietary: this.state.dietary, 
            additional: this.state.additional === -1 ? undefined : false
          }),
          headers: {"Content-Type": "application/json"}})
          .then((res) => this.doSaveResp(res))
          .catch(() => this.doSaveError("failed to connect to server"));
      }
    }
  };
  
  // Called when the server responds with to a request for guest details.
  doRefreshResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doRefreshJson)
          .catch(() => this.doRefreshError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doRefreshError)
          .catch(() => this.doRefreshError("400 response is not text"));
    } else {
      this.doRefreshError(`bad status code from /api/loadGuest ${res.status}`);
    }
  }; 

  // Called when the details of the guest is received. Turns off Error message.
  doRefreshJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }
    if (data.guest === undefined) {
      console.error("200 response missing guest", data);
      return;
    }
    const guest: undefined | InvitedGuest = parseGuest(data.guest);
    if (guest === undefined) {
      console.error("200 response guest invalid", data.guest);
      return;
    }
    if (guest.additional === undefined) {  // not sure about additional
      this.setState({originalDetails: guest, dietary: guest.dietary, additional: -1, 
                    loading: false, message: ""});
    } else if (guest.additional.kind === "none") {  // sure not to bring
      this.setState({originalDetails: guest, dietary: guest.dietary, additional: 0, 
        loading: false, message: ""});
    } else {  // sure to bring
      this.setState({originalDetails: guest, dietary: guest.dietary, additional: 1, 
          additionalName: guest.additional.name, additionalDietary: guest.additional.dietary, 
          loading: false, message: ""});
    }
  };

  // Called if an error occurs trying to load the guestList Page. Display the error message.
  doRefreshError = (msg: string): void => {
    console.error(`Error fetching /api/loadGuest: ${msg}`);
    this.setState({loading: false, message: msg});
  };

  // Called when the server responds to a request for guest details updates.
  doSaveResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doSaveJson)
          .catch(() => this.doSaveError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doSaveError)
          .catch(() => this.doSaveError("400 response is not text"));
    } else {
      this.doSaveError(`bad status code from /api/updateGuest ${res.status}`);
    }
  }; 

  // Called when the response of updating a guest detail is received. 
  // Display success message if successful.
  doSaveJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }
    if (data.updated === undefined || typeof data.updated !== "boolean") {
      console.error("200 response missing updated", data);
      return;
    }
    if (!data.updated) {
      console.error("200 response updating failed", data);
      return;
    } 
    this.setState({message: "Guest Info Successfully Updated"});
  };

  // Called if an error occurs trying to updating the guest details. Display the error message.
  doSaveError = (msg: string): void => {
    console.error(`Error fetching /api/updateGuest: ${msg}`);
    this.setState({loading: false, message: msg});
  };
}