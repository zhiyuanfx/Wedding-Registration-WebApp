import { isRecord } from "./record";

/** Description of the total number of guests and families from each side of the family */
export type Summary = {
  // RI: 0 <= Molly.famNum <= Molly.min <= Molly.max, 0 <= James.famNum <= James.min <= James.max
  //     min, max, famNum are non-negative integers
  Molly: {readonly min: number, readonly max: number, readonly famNum: number},
  James: {readonly min: number, readonly max: number, readonly famNum: number}
};

/**
 * Parses unknown data into a guest number summary. Will log an error and return undefined
 * if it is not a valid summary.
 * @param val unknown data to parse into a summary
 * @return Summary if val is a valid summary and undefined otherwise
 */
export const parseSummary = (val: unknown): undefined | Summary => {
  if (!isRecord(val)) {
    console.error("not a summary", val)
    return undefined;
  }

  if (val.Molly === undefined || !isRecord(val.Molly) || 
      val.James === undefined || !isRecord(val.James)) {
    console.error("not a summary, missing 'host'", val)
    return undefined;
  }

  if (val.Molly.min === undefined || typeof val.Molly.min !== "number" || 
      val.Molly.max === undefined || typeof val.Molly.max !== "number" ||
      val.Molly.famNum === undefined || typeof val.Molly.famNum !== "number") {
    console.error("not a summary, Molly missing 'min', 'max', or 'famNum'", val)
    return undefined;
  } 
  
  if (val.James.min === undefined || typeof val.James.min !== "number" || 
      val.James.max === undefined || typeof val.James.max !== "number" ||
      val.James.famNum === undefined || typeof val.James.famNum !== "number") {
    console.error("not a summary, James missing 'min', 'max', or 'famNum'", val)
    return undefined;
  }  

  if (val.Molly.min !== Math.floor(val.Molly.min) || val.Molly.max !== Math.floor(val.Molly.max) ||
      val.Molly.famNum !== Math.floor(val.Molly.famNum) || val.James.min !== Math.floor(val.James.min) ||
      val.James.max !== Math.floor(val.James.max) || val.James.famNum !== Math.floor(val.James.famNum)) {
    console.error("not a summary, 'min', 'max', and 'famNum' must be integers", val)
    return undefined;
  }

  if (!(0 <= val.Molly.famNum && val.Molly.famNum <= val.Molly.min && val.Molly.min <= val.Molly.max) || 
      !(0 <= val.James.famNum && val.James.famNum <= val.James.min && val.James.min <= val.James.max)) {
    console.error("not a summary, 'min', 'max', and 'famNum' are invalid", val)
    return undefined;
  }

  return {Molly: {min: val.Molly.min, max: val.Molly.max, famNum: val.Molly.famNum}, 
          James: {min: val.James.min, max: val.James.max, famNum: val.James.famNum}};
};