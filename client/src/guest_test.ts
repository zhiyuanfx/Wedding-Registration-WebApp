import * as assert from 'assert';
import { parseGuest, InvitedGuest } from './guest';

describe('guest', function() {
  
  it('parseGuest', function() {
    // Error Case, invited guest not a record
    assert.deepStrictEqual(parseGuest(3), undefined);
    assert.deepStrictEqual(parseGuest("not record"), undefined);

    // Error Case, missing guest name
    assert.deepStrictEqual(parseGuest({host: "James", isFamily: true, 
      dietary: "", additional: undefined }), undefined);
    assert.deepStrictEqual(parseGuest({name: 3, host: "James", isFamily: true, 
      dietary: "", additional: undefined }), undefined);

    // Error Case, host missing or invalid
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "J", isFamily: true, 
      dietary: "", additional: undefined }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "MM", isFamily: true, 
      dietary: "", additional: undefined }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", isFamily: true, 
      dietary: "", additional: undefined }), undefined);

    // Error Case, isFamily missing
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", 
      dietary: "", additional: undefined }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "Molly", isFamily: "asd", 
      dietary: "", additional: undefined }), undefined);

    // Error Case, dietary missing
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      additional: undefined }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: 3, additional: undefined }), undefined);

    // Error Case, additional not a record 
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: 3 }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: "asdas" }), undefined);
    
    // Error Case, additional kind missing
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {} }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {name: "name", dietary: "?"} }), undefined);
    
    // Error Case, additional name missing
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {kind: "brought", name: 3, dietary: "?"} }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {kind: "brought", dietary: "?"} }), undefined);

    // Error Case, additional dietary missing
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {kind: "brought", name: "fx", dietary: 2} }), undefined);
    assert.deepStrictEqual(parseGuest({name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "a", additional: {kind: "brought", name: 3} }), undefined);

    // Normal Case, additional unknown
    const guest1: InvitedGuest = {name: "zhiyuan", host: "James", isFamily: true, 
      dietary: "", additional: undefined};
    assert.deepStrictEqual(parseGuest(guest1), guest1);
    const guest2: InvitedGuest = {name: "zhiyuan2", host: "Molly", isFamily: false, 
      dietary: "ss", additional: undefined};
    assert.deepStrictEqual(parseGuest(guest2), guest2);

    // Normal Case, additional brought
    const guest3: InvitedGuest = {name: "zhiyuan3", host: "James", isFamily: true, 
      dietary: "aa", additional: {kind: "brought", name: "fx", dietary: "happy"}};
    assert.deepStrictEqual(parseGuest(guest3), guest3);
    const guest4: InvitedGuest = {name: "zhiyua4", host: "Molly", isFamily: true, 
      dietary: "aasda", additional: {kind: "brought", name: "fx2", dietary: "happy2"}};
    assert.deepStrictEqual(parseGuest(guest4), guest4);

    // Normal Case, additional not brought
    const guest5: InvitedGuest = {name: "zhxxx", host: "James", isFamily: true, 
      dietary: "aa", additional: {kind: "none"}};
    assert.deepStrictEqual(parseGuest(guest5), guest5);
    const guest6: InvitedGuest = {name: "zashdkasd", host: "Molly", isFamily: false, 
      dietary: "aasda", additional: {kind: "none"}};
    assert.deepStrictEqual(parseGuest(guest6), guest6);
  });

});