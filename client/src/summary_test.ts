import * as assert from 'assert';
import { Summary, parseSummary } from './summary';

describe('summary', function() {

  it('parseSummary', function() {
    // Error Case, summary not a record
    assert.deepStrictEqual(parseSummary(3), undefined);
    assert.deepStrictEqual(parseSummary("not record"), undefined);

    // Error Case, host missing
    assert.deepStrictEqual(parseSummary({M: {min: 3, max: 4, famNum: 2}, James: {min: 1, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: "not record", James: {min: 1, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: 2}}), undefined);

    // Error Case, Molly min, max, or famNum missing
    assert.deepStrictEqual(parseSummary({Molly: {max: 4, famNum: 2}, James: {min: 1, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: "nan"}, James: {min: 1, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4}, James: {min: 1, max: 2, famNum: 0}}), undefined);

    // Error Case, James min, max, or famNum missing
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: 2}, James: {max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: 2}, James: {min: 1, max: "nan", famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: 2}, James: {}}), undefined);

    // Error Case, min, max, or famNum not integers
    assert.deepStrictEqual(parseSummary({Molly: {min: 3.1, max: 4, famNum: 2}, James: {min: 1.2, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4.3, famNum: 2}, James: {min: 1, max: 2, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: 2}, James: {min: 0.1, max: 2, famNum: 0}}), undefined);

    // Error Case, min, max, or famNum not valid
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 2, famNum: 2}, James: {min: 1, max: 0, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 4, famNum: -1}, James: {min: 2, max: 1, famNum: 0}}), undefined);
    assert.deepStrictEqual(parseSummary({Molly: {min: 3, max: 2, famNum: 2}, James: {min: 2, max: 2, famNum: 3}}), undefined);

    // Normal Case, Summary parsed
    const summary1: Summary = {Molly: {min: 3, max: 4, famNum: 2}, James: {min: 2, max: 2, famNum: 0}}
    const summary2: Summary = {Molly: {min: 3, max: 5, famNum: 2}, James: {min: 2, max: 4, famNum: 2}}
    const summary3: Summary = {Molly: {min: 10, max: 17, famNum: 5}, James: {min: 20, max: 29, famNum: 15}}
    assert.deepStrictEqual(parseSummary(summary1), summary1);
    assert.deepStrictEqual(parseSummary(summary2), summary2);
    assert.deepStrictEqual(parseSummary(summary3), summary3);
  });
});