import firebase from 'firebase/app';
import 'firebase/auth';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "course-outlines.firebaseapp.com",
  databaseURL: "https://course-outlines.firebaseio.com",
  projectId: "course-outlines",
  storageBucket: "course-outlines.appspot.com"
});

export default firebase;
