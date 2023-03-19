import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyACXne0kILvgjViQnDxcIk8FsUQchvMhzM",
    authDomain: "danki-instagram-a8fb5.firebaseapp.com",
    projectId: "danki-instagram-a8fb5",
    storageBucket: "danki-instagram-a8fb5.appspot.com",
    messagingSenderId: "149338175018",
    appId: "1:149338175018:web:dddb637032fcb38948f553",
    measurementId: "G-LDE0HFCNMS"
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const functions = firebase.functions();

export {db, auth, storage, functions};