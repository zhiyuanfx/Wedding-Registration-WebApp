import React, { Component, MouseEvent } from "react";
import { isRecord } from './record';
import { InvitedGuest, parseGuest } from "./guest";
import { Summary, parseSummary } from "./summary";

type GuestListProps = {
  /** Called to go to the AddGuest Page. */
  onAddGuestClick: () => void,

  /** Called to go to the GuestDetail Page. */
  onDetailClick: (name: string) => void
};

type GuestListState = {
  /** Currently saved guests. */
  currentGuests: InvitedGuest[],

  /** Current summary of guest number. */
  currentSummary: Summary,

  /** Waiting for response from the server. */
  loading: boolean,

  /** Error message to display if something went wrong.  */
  error: string
}

/** UI for viewing the list of saved guests and people number summary. */
export class GuestList extends Component<GuestListProps, GuestListState> {

  constructor(props: GuestListProps) {
    super(props);

    this.state = {currentGuests: [], currentSummary: {Molly: {min: 0, max: 0, famNum: 0}, 
                  James: {min: 0, max: 0, famNum: 0}}, loading: true, error: ""};
  }

  componentDidMount = (): void => {
    this.doRefreshClick();    
  };

  render = (): JSX.Element => {
    if (this.state.loading === true) {
      return <p>Loading Contents...</p>;
    } else {
      return <div>
              <h1>Guest List</h1>
              {this.renderGuestList()}
              <h2>Summary</h2>
              {this.renderSummary()}
              <button type="button" onClick={this.props.onAddGuestClick}>Add Guest</button>
              <button type="button" onClick={this.doRefreshClick}>Refresh</button>
              {this.renderError()}
            </div>;
    }
  };

  // Renders the error message. 
  renderError = (): JSX.Element => {
    return <p style={{ color: 'red' }}>{this.state.error}</p>
  };

  // renders the list of guests and whether they are bringing additional guest
  renderGuestList = (): JSX.Element => {
    const guests: JSX.Element[] = [];
    for (const guest of this.state.currentGuests) {
      const number: string = (guest.additional === undefined || 
                              guest.additional.kind === "brought") ? "+1" : "+0";
      const questionMark: string = guest.additional === undefined ? "?" : "";
      guests.push(
        <li key={guest.name}>
          <a href="#" onClick={(evt) => this.doDetailClick(evt, guest.name)}>{guest.name}</a>
          <span>   Guest of {guest.host} {number}{questionMark}</span>
        </li>);
    }
    return <ul>{guests}</ul>;
  };

  // renders the summary of the number of guests coming to the wedding
  renderSummary = (): JSX.Element => {
    const summary = this.state.currentSummary;
    const MollyRange: string = summary.Molly.min === summary.Molly.max ? 
                          `${summary.Molly.min}  ` : `${summary.Molly.min}-${summary.Molly.max}`;
    const MollyFamily: string = `guest(s) of Molly (${summary.Molly.famNum} family)`;
    const JamesRange: string = summary.James.min === summary.James.max ? 
                          `${summary.James.min}  ` : `${summary.James.min}-${summary.James.max}`;
    const JamesFamily: string = `guest(s) of James (${summary.James.famNum} family)`;
    return <div>
            <p>{MollyRange} {MollyFamily}</p>
            <p>{JamesRange} {JamesFamily}</p>
          </div>;
  };

  // Refresh GuestList Page, Acccesses /guestList server endpoint and receives list 
  // of saved guests and summary of guest number. 
  doRefreshClick = (): void => {
    this.setState({loading: true, error: ""});
    fetch("/api/guestList")
      .then((res) => this.doRefreshResp(res))
      .catch(() => this.doRefreshError("failed to connect to server"));
  };

  // Called when the server responds with to a request for guest list and summary.
  doRefreshResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.doRefreshJson)
          .catch(() => this.doRefreshError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doRefreshError)
          .catch(() => this.doRefreshError("400 response is not text"));
    } else {
      this.doRefreshError(`bad status code from /api/guestList ${res.status}`);
    }
  }; 
  
  // Called when the list of saved guests and guest number summary are received. 
  // Turns off Error message if data is valid.
  doRefreshJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("200 response is not a record", data);
      return;
    }
    if (data.guests === undefined || data.summary === undefined) {
      console.error("200 response missing guests or summary", data);
      return;
    }
    if (!Array.isArray(data.guests)) {
      console.error("200 response guests not an array", data.guests);
      return;
    }
    const summary: undefined | Summary = parseSummary(data.summary);
    if (summary === undefined) {
      console.error("200 response summary is invalid", data.summary);
      return;
    }
    const guests: InvitedGuest[] = [];
    for (const guestData of data.guests) {
      const guest: undefined | InvitedGuest = parseGuest(guestData);
      if (guest === undefined) {
        console.error("200 response guests is invalid", data.guests);
        return;
      }
      guests.push(guest);
    }
    this.setState({currentGuests: guests, currentSummary: summary, loading: false, error: ""});
  };

  // Called if an error occurs trying to load the guestList Page. Display the error message.
  doRefreshError = (msg: string): void => {
    console.error(`Error fetching /api/guestList: ${msg}`);
    this.setState({loading: false, error: msg});
  };

  // Enters the GuestDetail Page of the clicked guest.
  doDetailClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onDetailClick(name);
  };
}