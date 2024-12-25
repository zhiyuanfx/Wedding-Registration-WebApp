import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

type Host = "James" | "Molly";

/** Description of a directly invited guest. */
export type InvitedGuest = {
  name: string,
  host: Host,
  isFamily: boolean,
  dietary: string,
  additional: undefined | BroughtGuest,
}; 

// Description of an indirectly brought guest.
type BroughtGuest = {kind: "none"} | {kind: "brought", name: string, dietary: string};

// Map from invited guests' name to their details.
const guests: Map<string, InvitedGuest> = new Map();

/** Testing function to remove all the invited guests. */
export const resetForTesting = (): void => {
  guests.clear();
};

/**
 * Returns an array of all the directly invited guests as well as a summary of guest number. 
 * @param _req the request
 * @param res the response
 */
export const guestList = (_req: SafeRequest, res: SafeResponse): void => {
  const vals = Array.from(guests.values());
  const summary = {
    Molly: {min: 0, max: 0, famNum: 0},
    James: {min: 0, max: 0, famNum: 0}
  }
  // Inv: 0 <= Molly.famNum <= Molly.min <= Molly.max, 0 <= James.famNum <= James.min <= James.max,  
  //      Molly.famNum + James.famNum <= vals.length <= Molly.min + Jame.min <= 
  //      Molly.max + Jame.max <= 2 * vals.length
  for (const guest of vals) {
    const hostSdie: Host = guest.host;
    const host = summary[hostSdie];
    host.min += 1;
    host.max += 1;
    host.famNum += guest.isFamily ? 1 : 0;
    if (guest.additional === undefined) {
        host.max += 1;
    } else if (guest.additional.kind === "brought") {
        host.min += 1;
        host.max += 1;
    } else {
        // decided not to bring additional, do nothing 
    }
  }
  res.send({guests: vals, summary: summary});
};

/**
 * Adds the guest to the invited list. Returns true if the saving was successful. Returns 400 
 * Error Code if name, host, or family information is missing or invalid. Returns 400 Error Code 
 * if the guest is already added.
 * @param req the request
 * @param res the response
 */
export const addGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  
  const originalGuest: undefined | InvitedGuest = guests.get(name);
  if (originalGuest !== undefined) {
    res.status(400).send('guest already added');
    return;
  }

  const host = req.body.host;
  if (host === undefined || typeof host !== 'string' || !(host === "James" || host === "Molly")) {
    res.status(400).send('required argument "host" was missing or invalid');
    return;
  } 

  const isFamily = req.body.isFamily;
  if (isFamily === undefined || typeof isFamily !== 'boolean') {
    res.status(400).send('required argument "isFamily" was missing or invalid');
    return;
  }

  const guest: InvitedGuest = {
    name: name,
    host: host,
    isFamily: isFamily,
    dietary: "",
    additional: undefined
  }

  guests.set(guest.name, guest);
  res.send({saved: true});
};

/**
 * Returns the details of the indicated invited guest. Returns 400 Error Code if name is missing
 * or invalid or the named guest is not found.
 * @param req the request
 * @param res the response
 */
export const loadGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const guest: undefined | InvitedGuest = guests.get(name);
  if (guest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  res.send({guest: guest});
};

/**
 * Updates the details of the indicaed guest. Returns true if the update was successful. Returns 
 * 400 Error Code if name or dietary is missing, or indicated guest has not been added, or 
 * additional is missing (not given as a boolean), or dietary or name of the additional guest
 * is not given.
 * @param req the request
 * @param res the response
 */
export const updateGuest = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }

  const dietary = req.body.dietary;
  if (dietary === undefined || typeof dietary !== 'string') {
    res.status(400).send('required argument "dietary" was missing');
    return;
  }

  const originalGuest = guests.get(name);
  if (originalGuest === undefined) {
    res.status(400).send(`no guest with name '${name}'`);
    return;
  }

  const additional = req.body.additional;
  if (additional === undefined) {
    // not sure whether to bring an additional guest
    originalGuest.dietary = dietary;
    originalGuest.additional = undefined;
    res.send({updated: true});
  } else if (typeof additional !== 'boolean') {
    res.status(400).send('required argument "additional" was missing, must be a boolean');
    return;
  } else if (additional) {
    // if sure an additional guest will be brought
    const additionalName = req.body.additionalName;
    if (additionalName === undefined || typeof additionalName !== 'string') {
      res.status(400).send('required argument "additionalName" was missing');
      return;
    }
    
    const additionalDietary = req.body.additionalDietary;
    if (additionalDietary === undefined || typeof additionalDietary !== 'string') {
      res.status(400).send('required argument "additionalDietary" was missing');
      return;
    }

    const broughtGuest: BroughtGuest = {
      kind: "brought", 
      name: additionalName, 
      dietary: additionalDietary
    }

    originalGuest.dietary = dietary;
    originalGuest.additional = broughtGuest;
    res.send({updated: true});
  } else {
    // if sure no additional guest will be brought
    originalGuest.dietary = dietary;
    originalGuest.additional = {kind: "none"};
    res.send({updated: true});
  }
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
