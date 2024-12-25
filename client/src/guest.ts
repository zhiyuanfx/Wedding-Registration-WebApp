import { isRecord } from "./record";

// Only two available hosts
type Host = "James" | "Molly";

/** Description of a directly invited guest. */
export type InvitedGuest = {
  readonly name: string,
  readonly host: Host,
  readonly isFamily: boolean,
  readonly dietary: string,
  readonly additional: undefined | BroughtGuest,
}; 

// Description of an indirectly brought guest.
type BroughtGuest = {readonly kind: "none"} | 
                    {readonly kind: "brought", readonly name: string, readonly dietary: string};

/**
 * Parses unknown data into an invited guest. Will log an error and return undefined
 * if it is not a valid invited guest.
 * @param val unknown data to parse into an guest
 * @return InvitedGuest if val is a valid guest and undefined otherwise
 */
export const parseGuest = (val: unknown): undefined | InvitedGuest => {
  if (!isRecord(val)) {
    console.error("not a guest", val)
    return undefined;
  }

  if (typeof val.name !== "string") {
    console.error("not a guest: missing 'name'", val)
    return undefined;
  }

  if (typeof val.host !== "string" || !(val.host === "James" || val.host === "Molly")) {
    console.error("not a guest: missing or invalid'host'", val)
    return undefined;
  }
  
  if (typeof val.isFamily !== "boolean") {
    console.error("not a guest: missing 'isFamily'", val)
    return undefined;
  }

  if (typeof val.dietary !== "string") {
    console.error("not a guest: missing 'dietary'", val)
    return undefined;
  }

  if (val.additional !== undefined) {
    // check if additional is valid Brought Guest below
    if (!isRecord(val.additional)) {
      console.error("not a brought guest", val)
      return undefined;
    }
    
    if (val.additional.kind === "none") {
      return {name: val.name, host: val.host, isFamily: val.isFamily, dietary: val.dietary, 
              additional: {kind: "none"}
      };
    } else if (val.additional.kind === "brought") {
      if (typeof val.additional.name !== "string") {
        console.error("not a brought guest: missing 'name'", val)
        return undefined;
      }

      if (typeof val.additional.dietary !== "string") {
        console.error("not a brought guest: missing 'dietary'", val)
        return undefined;
      }

      return {name: val.name, host: val.host, isFamily: val.isFamily, dietary: val.dietary, 
          additional: {kind: "brought", name: val.additional.name, dietary: val.additional.dietary}
      };

    } else {
      console.error("not a brought guest: missing 'kind'", val)
      return undefined;
    }
  } else {
    return {name: val.name, host: val.host, isFamily: val.isFamily, dietary: val.dietary, 
            additional: undefined};
  }
};

