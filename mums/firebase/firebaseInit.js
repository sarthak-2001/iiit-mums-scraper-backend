const firebase = require('firebase')
require("firebase/firestore");
const firebaseConfig = require('./firebaseConfig')
 
const firebaseApp = firebase.initializeApp(firebaseConfig)
module.exports = firebaseApp.firestore()