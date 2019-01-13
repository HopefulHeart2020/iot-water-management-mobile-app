const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });




exports.lowercase = functions.database.ref('users/{UID}')
  .onWrite(event => {
    const userKey = event.data.key;
    const userValue = event.data.val();
    const lowercaseBody = userValue.body.toLowerCase();

    return event.data.ref.child('lowercase').set(lowercase);
  });
