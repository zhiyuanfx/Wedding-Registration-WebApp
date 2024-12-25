import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { InvitedGuest, addGuest, guestList, loadGuest, resetForTesting, updateGuest } from './routes';


describe('routes', function() {

  it('guestList', function() {
    // straight line, at least 2 tests
    const listReq1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp1 = httpMocks.createResponse();
    guestList(listReq1, listResp1);
    assert.deepStrictEqual(listResp1._getStatusCode(), 200);
    assert.deepStrictEqual(listResp1._getData(), {guests: [], 
            summary: {Molly: {min: 0, max: 0, famNum: 0}, James: {min: 0, max: 0, famNum: 0}}});


    const guest1: InvitedGuest = {
      name: "zhiyuan",
      host: "James",
      isFamily: true,
      dietary: "",
      additional: undefined 
    };

    const guest2: InvitedGuest = {
      name: "zhiyuan2",
      host: "Molly",
      isFamily: false,
      dietary: "",
      additional: undefined
    };

    const guest3: InvitedGuest = {
      name: "zhiyuanjia", 
      host: "James", 
      dietary: "",
      isFamily: false, 
      additional: undefined
    };
    
    const addReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp1 = httpMocks.createResponse();
    addGuest(addReq1, addResp1);
    assert.deepStrictEqual(addResp1._getStatusCode(), 200);
    assert.deepStrictEqual(addResp1._getData(), {saved: true});
    const listReq2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp2 = httpMocks.createResponse();
    guestList(listReq2, listResp2);
    assert.deepStrictEqual(listResp2._getStatusCode(), 200);
    assert.deepStrictEqual(listResp2._getData(), {guests: [guest1], 
      summary: {Molly: {min: 0, max: 0, famNum: 0}, James: {min: 1, max: 2, famNum: 1}}});

    const addReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan2", host: "Molly", isFamily: false}});
    const addResp2 = httpMocks.createResponse();
    addGuest(addReq2, addResp2);
    assert.deepStrictEqual(addResp2._getStatusCode(), 200);
    assert.deepStrictEqual(addResp2._getData(), {saved: true});
    const listReq3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp3 = httpMocks.createResponse();
    guestList(listReq3, listResp3);
    assert.deepStrictEqual(listResp3._getStatusCode(), 200);
    assert.deepStrictEqual(listResp3._getData(), {guests: [guest1,  guest2], 
      summary: {Molly: {min: 1, max: 2, famNum: 0}, James: {min: 1, max: 2, famNum: 1}}});
    
    guest1.dietary = "none";
    guest1.additional = {kind: "brought", name: "fx", dietary: "happy"};
    const updateReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "none", additional: true, 
              additionalName: "fx", additionalDietary: "happy"}});
    const updateResp1 = httpMocks.createResponse();
    updateGuest(updateReq1, updateResp1);
    assert.deepStrictEqual(updateResp1._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp1._getData(), {updated: true});
    const listReq4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp4 = httpMocks.createResponse();
    guestList(listReq4, listResp4);
    assert.deepStrictEqual(listResp4._getStatusCode(), 200);
    assert.deepStrictEqual(listResp4._getData(), {guests: [guest1,  guest2], 
      summary: {Molly: {min: 1, max: 2, famNum: 0}, James: {min: 2, max: 2, famNum: 1}}});

    const addReq3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp3 = httpMocks.createResponse();
    addGuest(addReq3, addResp3);
    assert.deepStrictEqual(addResp3._getStatusCode(), 400);
    assert.deepStrictEqual(addResp3._getData(), 'guest already added');
    const listReq5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp5 = httpMocks.createResponse();
    guestList(listReq5, listResp5);
    assert.deepStrictEqual(listResp5._getStatusCode(), 200);
    assert.deepStrictEqual(listResp5._getData(), {guests: [guest1, guest2], 
      summary: {Molly: {min: 1, max: 2, famNum: 0}, James: {min: 2, max: 2, famNum: 1}}});

    const addReq4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
        body: {name: "zhiyuanjia", host: "James", isFamily: false, additional: undefined}});
    const addResp4 = httpMocks.createResponse();
    addGuest(addReq4, addResp4);
    assert.deepStrictEqual(addResp4._getStatusCode(), 200);
    assert.deepStrictEqual(addResp4._getData(), {saved: true});
    const listReq6 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp6 = httpMocks.createResponse();
    guestList(listReq6, listResp6);
    assert.deepStrictEqual(listResp6._getStatusCode(), 200);
    assert.deepStrictEqual(listResp6._getData(), {guests: [guest1, guest2, guest3], 
      summary: {Molly: {min: 1, max: 2, famNum: 0}, James: {min: 3, max: 4, famNum: 1}}});
    
    resetForTesting();
  });

  it('loadGuest', function() {
    const guest1: InvitedGuest = {
      name: "zhiyuan",
      host: "James",
      isFamily: true,
      dietary: "",
      additional: undefined 
    }
    const guest2: InvitedGuest = {
      name: "zhiyuan2",
      host: "Molly",
      isFamily: false,
      dietary: "",
      additional: undefined
    }
    const addReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp1 = httpMocks.createResponse();
    addGuest(addReq1, addResp1);
    assert.deepStrictEqual(addResp1._getStatusCode(), 200);
    assert.deepStrictEqual(addResp1._getData(), {saved: true});
    const addReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan2", host: "Molly", isFamily: false}});
    const addResp2 = httpMocks.createResponse();
    addGuest(addReq2, addResp2);
    assert.deepStrictEqual(addResp2._getStatusCode(), 200);
    assert.deepStrictEqual(addResp2._getData(), {saved: true});

    // Error Case, name is missing
    const loadReq1 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {namemm: "zhiyuan"}});
    const loadRes1 = httpMocks.createResponse();
    loadGuest(loadReq1, loadRes1);
    assert.deepStrictEqual(loadRes1._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes1._getData(), 'required argument "name" was missing');
    
    const loadReq2 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: true}});
    const loadRes2 = httpMocks.createResponse();
    loadGuest(loadReq2, loadRes2);
    assert.deepStrictEqual(loadRes2._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes2._getData(), 'required argument "name" was missing');

    const loadReq3 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {}});
    const loadRes3 = httpMocks.createResponse();
    loadGuest(loadReq3, loadRes3);
    assert.deepStrictEqual(loadRes3._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes3._getData(), 'required argument "name" was missing');
    
    // Error Case, named guest not found
    const loadReq4 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "what"}});
    const loadRes4 = httpMocks.createResponse();
    loadGuest(loadReq4, loadRes4);
    assert.deepStrictEqual(loadRes4._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes4._getData(), "no guest with name 'what'");

    const loadReq5 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan3"}});
    const loadRes5 = httpMocks.createResponse();
    loadGuest(loadReq5, loadRes5);
    assert.deepStrictEqual(loadRes5._getStatusCode(), 400);
    assert.deepStrictEqual(loadRes5._getData(), "no guest with name 'zhiyuan3'");

    // Normal Case, successfully loaded guest info
    const loadReq6 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan"}});
    const loadRes6 = httpMocks.createResponse();
    loadGuest(loadReq6, loadRes6);
    assert.deepStrictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), {guest: guest1});

    const loadReq7 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan2"}});
    const loadRes7 = httpMocks.createResponse();
    loadGuest(loadReq7, loadRes7);
    assert.deepStrictEqual(loadRes7._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes7._getData(), {guest: guest2});

    guest1.dietary = "none";
    guest1.additional = {kind: "brought", name: "fx", dietary: "happy"};
    const updateReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "none", additional: true, 
              additionalName: "fx", additionalDietary: "happy"}});
    const updateResp1 = httpMocks.createResponse();
    updateGuest(updateReq1, updateResp1);
    assert.deepStrictEqual(updateResp1._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp1._getData(), {updated: true});
    const loadReq8 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan"}});
    const loadRes8 = httpMocks.createResponse();
    loadGuest(loadReq8, loadRes8);
    assert.deepStrictEqual(loadRes8._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes8._getData(), {guest: guest1});

    resetForTesting();
  });

  it('addGuest', function() {
    const guest1: InvitedGuest = {
      name: "zhiyuan",
      host: "James",
      isFamily: true,
      dietary: "",
      additional: undefined 
    }

    const guest2: InvitedGuest = {
      name: "zhiyuan2",
      host: "Molly",
      isFamily: false,
      dietary: "",
      additional: undefined
    }
    const listReq1 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp1 = httpMocks.createResponse();
    guestList(listReq1, listResp1);
    assert.deepStrictEqual(listResp1._getStatusCode(), 200);
    assert.deepStrictEqual(listResp1._getData(), {guests: [], 
      summary: {Molly: {min: 0, max: 0, famNum: 0}, James: {min: 0, max: 0, famNum: 0}}});
    
    // Error Case, name is missing
    const addReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {host: "James", isFamily: true}});
    const addResp1 = httpMocks.createResponse();
    addGuest(addReq1, addResp1);
    assert.deepStrictEqual(addResp1._getStatusCode(), 400);
    assert.deepStrictEqual(addResp1._getData(), 'required argument "name" was missing');
    
    const addReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: 1, host: "James", isFamily: true}});
    const addResp2 = httpMocks.createResponse();
    addGuest(addReq2, addResp2);
    assert.deepStrictEqual(addResp2._getStatusCode(), 400);
    assert.deepStrictEqual(addResp2._getData(), 'required argument "name" was missing');

    // Error Case, named guest is already added 
    const addReq3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp3 = httpMocks.createResponse();
    addGuest(addReq3, addResp3);
    assert.deepStrictEqual(addResp3._getStatusCode(), 200);
    assert.deepStrictEqual(addResp3._getData(), {saved: true});
    const listReq2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp2 = httpMocks.createResponse();
    guestList(listReq2, listResp2);
    assert.deepStrictEqual(listResp2._getStatusCode(), 200);
    assert.deepStrictEqual(listResp2._getData(), {guests: [guest1], 
      summary: {Molly: {min: 0, max: 0, famNum: 0}, James: {min: 1, max: 2, famNum: 1}}});

    const addReq4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp4 = httpMocks.createResponse();
    addGuest(addReq4, addResp4);
    assert.deepStrictEqual(addResp4._getStatusCode(), 400);
    assert.deepStrictEqual(addResp4._getData(), "guest already added");

    const addReq5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "Molly", isFamily: false}});
    const addResp5 = httpMocks.createResponse();
    addGuest(addReq5, addResp5);
    assert.deepStrictEqual(addResp5._getStatusCode(), 400);
    assert.deepStrictEqual(addResp5._getData(), "guest already added");
    resetForTesting();

    // Error Case, host is missing or invalid
    const addReq6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", isFamily: false}});
    const addResp6 = httpMocks.createResponse();
    addGuest(addReq6, addResp6);
    assert.deepStrictEqual(addResp6._getStatusCode(), 400);
    assert.deepStrictEqual(addResp6._getData(), 'required argument "host" was missing or invalid');

    const addReq7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: 3, isFamily: false}});
    const addResp7 = httpMocks.createResponse();
    addGuest(addReq7, addResp7);
    assert.deepStrictEqual(addResp7._getStatusCode(), 400);
    assert.deepStrictEqual(addResp7._getData(), 'required argument "host" was missing or invalid');

    const addReq8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "falseHost", isFamily: false}});
    const addResp8 = httpMocks.createResponse();
    addGuest(addReq8, addResp8);
    assert.deepStrictEqual(addResp8._getStatusCode(), 400);
    assert.deepStrictEqual(addResp8._getData(), 'required argument "host" was missing or invalid');

    const addReq9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "JJames", isFamily: false}});
    const addResp9 = httpMocks.createResponse();
    addGuest(addReq9, addResp9);
    assert.deepStrictEqual(addResp9._getStatusCode(), 400);
    assert.deepStrictEqual(addResp9._getData(), 'required argument "host" was missing or invalid');

    // Error Case, isFamily is missing or invalid
    const addReq10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James"}});
    const addResp10 = httpMocks.createResponse();
    addGuest(addReq10, addResp10);
    assert.deepStrictEqual(addResp10._getStatusCode(), 400);
    assert.deepStrictEqual(addResp10._getData(), 'required argument "isFamily" was missing or invalid');

    const addReq11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "Molly", isFamily: "false"}});
    const addResp11 = httpMocks.createResponse();
    addGuest(addReq11, addResp11);
    assert.deepStrictEqual(addResp11._getStatusCode(), 400);
    assert.deepStrictEqual(addResp11._getData(), 'required argument "isFamily" was missing or invalid');

    // Normal Case, guest successfully added
    const addReq12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp12 = httpMocks.createResponse();
    addGuest(addReq12, addResp12);
    assert.deepStrictEqual(addResp3._getStatusCode(), 200);
    assert.deepStrictEqual(addResp3._getData(), {saved: true});
    const listReq3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp3 = httpMocks.createResponse();
    guestList(listReq3, listResp3);
    assert.deepStrictEqual(listResp3._getStatusCode(), 200);
    assert.deepStrictEqual(listResp3._getData(), {guests: [guest1], 
      summary: {Molly: {min: 0, max: 0, famNum: 0}, James: {min: 1, max: 2, famNum: 1}}});

    const addReq13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan2", host: "Molly", isFamily: false}});
    const addResp13 = httpMocks.createResponse();
    addGuest(addReq13, addResp13);
    assert.deepStrictEqual(addResp13._getStatusCode(), 200);
    assert.deepStrictEqual(addResp13._getData(), {saved: true});
    const listReq4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/guestList', query: {}});
    const listResp4 = httpMocks.createResponse();
    guestList(listReq4, listResp4);
    assert.deepStrictEqual(listResp4._getStatusCode(), 200);
    assert.deepStrictEqual(listResp4._getData(), {guests: [guest1, guest2], 
      summary: {Molly: {min: 1, max: 2, famNum: 0}, James: {min: 1, max: 2, famNum: 1}}});

    resetForTesting();
  });

  it('updateGuest', function() {
    const guest1: InvitedGuest = {
      name: "zhiyuan",
      host: "James",
      isFamily: true,
      dietary: "",
      additional: undefined 
    }
    const guest2: InvitedGuest = {
      name: "zhiyuan2",
      host: "Molly",
      isFamily: false,
      dietary: "",
      additional: undefined
    }
    const addReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan", host: "James", isFamily: true}});
    const addResp1 = httpMocks.createResponse();
    addGuest(addReq1, addResp1);
    assert.deepStrictEqual(addResp1._getStatusCode(), 200);
    assert.deepStrictEqual(addResp1._getData(), {saved: true});
    const addReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/addGuest',
       body: {name: "zhiyuan2", host: "Molly", isFamily: false}});
    const addResp2 = httpMocks.createResponse();
    addGuest(addReq2, addResp2);
    assert.deepStrictEqual(addResp2._getStatusCode(), 200);
    assert.deepStrictEqual(addResp2._getData(), {saved: true});
    
    // Error Case, name is missing
    const updateReq1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {dietary: "noneasd", additional: false}});
    const updateResp1 = httpMocks.createResponse();
    updateGuest(updateReq1, updateResp1);
    assert.deepStrictEqual(updateResp1._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp1._getData(), 'required argument "name" was missing');

    const updateReq2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: 3, dietary: "noneasd", additional: false}});
    const updateResp2 = httpMocks.createResponse();
    updateGuest(updateReq2, updateResp2);
    assert.deepStrictEqual(updateResp2._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp2._getData(), 'required argument "name" was missing');

    // Error Case, dietary is missing
    const updateReq3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", additional: false}});
    const updateResp3 = httpMocks.createResponse();
    updateGuest(updateReq3, updateResp3);
    assert.deepStrictEqual(updateResp3._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp3._getData(), 'required argument "dietary" was missing');

    const updateReq4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: true, additional: false}});
    const updateResp4 = httpMocks.createResponse();
    updateGuest(updateReq4, updateResp4);
    assert.deepStrictEqual(updateResp4._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp4._getData(), 'required argument "dietary" was missing');

    // Error Case, indicated guest not found
    const updateReq5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan3", dietary: "happy", additional: false}});
    const updateResp5 = httpMocks.createResponse();
    updateGuest(updateReq5, updateResp5);
    assert.deepStrictEqual(updateResp5._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp5._getData(), "no guest with name 'zhiyuan3'");

    const updateReq6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "fx", dietary: "happy"}});
    const updateResp6 = httpMocks.createResponse();
    updateGuest(updateReq6, updateResp6);
    assert.deepStrictEqual(updateResp6._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp6._getData(), "no guest with name 'fx'");

    // Error Case, additional not given as boolean
    const updateReq7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: "true"}});
    const updateResp7 = httpMocks.createResponse();
    updateGuest(updateReq7, updateResp7);
    assert.deepStrictEqual(updateResp7._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp7._getData(), 'required argument "additional" was missing, must be a boolean');

    const updateReq8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: 3}});
    const updateResp8 = httpMocks.createResponse();
    updateGuest(updateReq8, updateResp8);
    assert.deepStrictEqual(updateResp8._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp8._getData(), 'required argument "additional" was missing, must be a boolean');

    // Error Case, additionalName is missing
    const updateReq9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: true, additionalDietary: "happy"}});
    const updateResp9 = httpMocks.createResponse();
    updateGuest(updateReq9, updateResp9);
    assert.deepStrictEqual(updateResp9._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp9._getData(), 'required argument "additionalName" was missing');

    const updateReq10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: true, additionalName: true, additionalDietary: "happy"}});
    const updateResp10 = httpMocks.createResponse();
    updateGuest(updateReq10, updateResp10);
    assert.deepStrictEqual(updateResp10._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp10._getData(), 'required argument "additionalName" was missing');

    // Error Case, additionalDietary is missing
    const updateReq11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: true, additionalName: "happy"}});
    const updateResp11 = httpMocks.createResponse();
    updateGuest(updateReq11, updateResp11);
    assert.deepStrictEqual(updateResp11._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp11._getData(), 'required argument "additionalDietary" was missing');

    const updateReq12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "happy", additional: true, additionalName: "what", additionalDietary: 3}});
    const updateResp12 = httpMocks.createResponse();
    updateGuest(updateReq12, updateResp12);
    assert.deepStrictEqual(updateResp12._getStatusCode(), 400);
    assert.deepStrictEqual(updateResp12._getData(), 'required argument "additionalDietary" was missing');

    // Updated successfully, unsure about additional guest
    guest1.additional = undefined;
    guest1.dietary = "???";
    const updateReq13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "???"}});
    const updateResp13 = httpMocks.createResponse();
    updateGuest(updateReq13, updateResp13);
    assert.deepStrictEqual(updateResp13._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp13._getData(), {updated: true});
    const loadReq1 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan"}});
    const loadRes1 = httpMocks.createResponse();
    loadGuest(loadReq1, loadRes1);
    assert.deepStrictEqual(loadRes1._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes1._getData(), {guest: guest1});

    guest2.additional = undefined;
    guest2.dietary = "happy";
    const updateReq14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan2", dietary: "happy", additional: undefined}});
    const updateResp14 = httpMocks.createResponse();
    updateGuest(updateReq14, updateResp14);
    assert.deepStrictEqual(updateResp14._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp14._getData(), {updated: true});
    const loadReq2 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan2"}});
    const loadRes2 = httpMocks.createResponse();
    loadGuest(loadReq2, loadRes2);
    assert.deepStrictEqual(loadRes2._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes2._getData(), {guest: guest2});

    // Updated successfully, sure to bring an additional guest
    guest1.additional = {kind: "brought", name: "fx", dietary: "No"};
    guest1.dietary = "!!!";
    const updateReq15 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "!!!", additional: true, additionalName: "fx", additionalDietary: "No"}});
    const updateResp15 = httpMocks.createResponse();
    updateGuest(updateReq15, updateResp15);
    assert.deepStrictEqual(updateResp15._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp15._getData(), {updated: true});
    const loadReq3 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan"}});
    const loadRes3 = httpMocks.createResponse();
    loadGuest(loadReq3, loadRes3);
    assert.deepStrictEqual(loadRes3._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes3._getData(), {guest: guest1});

    guest2.additional = {kind: "brought", name: "fxfx", dietary: "Yes"};
    guest2.dietary = "why";
    const updateReq16 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan2", dietary: "why", additional: true, additionalName: "fxfx", additionalDietary: "Yes"}});
    const updateResp16 = httpMocks.createResponse();
    updateGuest(updateReq16, updateResp16);
    assert.deepStrictEqual(updateResp16._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp16._getData(), {updated: true});
    const loadReq4 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan2"}});
    const loadRes4 = httpMocks.createResponse();
    loadGuest(loadReq4, loadRes4);
    assert.deepStrictEqual(loadRes4._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes4._getData(), {guest: guest2});

    // Updated successfully, sure to not bring an additional guest
    guest1.additional = {kind: "none"};
    guest1.dietary = "nonono";
    const updateReq17 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan", dietary: "nonono", additional: false}});
    const updateResp17 = httpMocks.createResponse();
    updateGuest(updateReq17, updateResp17);
    assert.deepStrictEqual(updateResp17._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp17._getData(), {updated: true});
    const loadReq5 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan"}});
    const loadRes5 = httpMocks.createResponse();
    loadGuest(loadReq5, loadRes5);
    assert.deepStrictEqual(loadRes5._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes5._getData(), {guest: guest1});

    guest2.additional = {kind: "none"};
    guest2.dietary = "yesyes";
    const updateReq18 = httpMocks.createRequest(
      {method: 'POST', url: '/api/updateGuest',
       body: {name: "zhiyuan2", dietary: "yesyes", additional: false}});
    const updateResp18 = httpMocks.createResponse();
    updateGuest(updateReq18, updateResp18);
    assert.deepStrictEqual(updateResp18._getStatusCode(), 200);
    assert.deepStrictEqual(updateResp18._getData(), {updated: true});
    const loadReq6 = httpMocks.createRequest( 
      {method: 'GET', url: '/api/loadGuest', query: {name: "zhiyuan2"}});
    const loadRes6 = httpMocks.createResponse();
    loadGuest(loadReq6, loadRes6);
    assert.deepStrictEqual(loadRes6._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes6._getData(), {guest: guest2});

    resetForTesting();
  });
});
