import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { GuestAdd } from "./GuestAdd";
import { GuestDetail } from "./GuestDetail";

type Page = {kind: "GuestAdd"} | {kind: "GuestList"} | {kind: "GuestDetail", name: string};

type WeddingAppState = {
  /** Stores state for the current page of the app to show. */
  show: Page
};

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: {kind: "GuestList"}};
  }
  
  render = (): JSX.Element => {
    if (this.state.show.kind === "GuestList") {
      return <GuestList onAddGuestClick={this.doAddGuestClick} 
                        onDetailClick={this.doDetailClick}/>
    } else if (this.state.show.kind === "GuestAdd") {
      return <GuestAdd onBackClick={this.doBackClick}></GuestAdd>
    } else {
      return <GuestDetail name={this.state.show.name} 
                          onBackClick={this.doBackClick}></GuestDetail>;
    }
  };

  // Come back to the GuestList Page.  
  doBackClick = (): void => {
    this.setState({show: {kind: "GuestList"}});
  };
  
  // Goes to the guest adding page.
  doAddGuestClick = (): void => {
    this.setState({show: {kind: "GuestAdd"}});
  };

  // Goes to the detail page of the guest
  doDetailClick = (name: string): void => {
    this.setState({show: {kind: "GuestDetail", name: name}})
  };
}