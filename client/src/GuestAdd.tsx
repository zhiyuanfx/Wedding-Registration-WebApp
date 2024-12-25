import React, { Component, MouseEvent, ChangeEvent } from "react";
import { isRecord } from "./record";

/** only two possible hosts */
export type Host = "James" | "Molly";

type GuestAddProps = {
  /** Called to go back to GuestList Page */
  onBackClick: () => void
}
 
type GuestAddState = {
  /** text in the name text box */
  name: string,

  /** host, either James or Molly */
  host: Host,

  /** true if this guest is a family, false otherwise */
  isFamily: boolean,

  /** Error Message to show for invalid inputs */
  error: string
};

/** UI for viewing adding a new guest. */
export class GuestAdd extends Component<GuestAddProps, GuestAddState> {

  constructor(props: GuestAddProps) {
    super(props);

    this.state = {name: "", host: "Molly", isFamily: false, error: ""};
  }

  render = (): JSX.Element => {
    return <div>
            <h1>Add Guest</h1>
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" onChange={this.doNameChange}></input>
            <h2>Guest Of:</h2>
            <div>
              <input type="radio" id="Molly" name="Host" value="Molly" 
                    onChange={this.doHostChange} checked={this.state.host === "Molly"}/>
              <label htmlFor="Molly">Molly</label>
            </div>
            <div>
              <input type="radio" id="James" name="Host" value="James" 
                    onChange={this.doHostChange} checked={this.state.host === "James"}/>
              <label htmlFor="James">James</label>
            </div>
            <input type="checkbox" id={"check"} checked={this.state.isFamily}
                onChange={this.doFamilyChange} />
            <label htmlFor={"check"}>Family</label>
            <div>
              <button type="button" onClick={this.doAddClick}>Add</button>
              <button type="button" onClick={this.props.onBackClick}>Back</button>
            </div>
            {this.renderError()}
          </div>;
  };

  // Renders the error message. 
  renderError = (): JSX.Element => {
    return <p style={{ color: 'red' }}>{this.state.error}</p>
  };

  // Change the input guest name. Turns off error message. 
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({name: evt.target.value, error: ""});
  };

  // Change the isFamily option. Turns off error message.
  doFamilyChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({isFamily: evt.target.checked, error: ""});
  };

  // Change the option for host. Turns off error message.
  doHostChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (evt.target.value !== "James" && evt.target.value !== "Molly") {
      // Just make typechecker happy, impossible case
      this.setState({error: "Invalid Host"});
    } else {
      this.setState({host: evt.target.value, error: ""});
    }
  };

  // Attempt to add the current guest. Goes back to GuestList Page if succeeded. Displays error
  // message if name is missing or error occured in accessing the server.
  doAddClick = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();
    if (this.state.name.trim().length === 0) {
      this.setState({error: "guest missing a name"});
    } else {
      fetch("/api/addGuest", {
        method: "POST", body: JSON.stringify({name: this.state.name, host: this.state.host, 
          isFamily: this.state.isFamily}),
        headers: {"Content-Type": "application/json"} })
        .then((res) => this.doAddResp(res))
        .catch(() => this.doAddError("failed to connect to server"));
    }
  };

  // Called when the server responds to a request for adding the indicated guest.
  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doAddJson)
          .catch(() => this.doAddError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doAddError)
          .catch(() => this.doAddError("400 response is not text"));
    } else {
      this.doAddError(`bad status code from /api/addGuest ${res.status}`);
    }
  };

  // Called when the response of adding new guest is received. Go back to GuestList page if
  // adding succeeded, otherwise displays error messages in accordance.
  doAddJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }
    if (data.saved === undefined || typeof data.saved !== "boolean") {
      console.error("200 response missing saved", data);
      return;
    }
    if (!data.saved) {
      console.error("200 response saving failed", data);
      return;
    } 
    this.props.onBackClick();
  };

  // Called if an error occurs trying to add the indicated guest. Display error message.
  doAddError = (msg: string): void => {
    console.error(`Error fetching /api/addGuest: ${msg}`);
    this.setState({error: msg});
  };
}