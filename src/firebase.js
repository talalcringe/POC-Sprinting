// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCixKbfO-qYomz0ia4Xxd33Fgu8Ilj4lxI',
  authDomain: 'sprinting-poc.firebaseapp.com',
  projectId: 'sprinting-poc',
  storageBucket: 'sprinting-poc.appspot.com',
  messagingSenderId: '125483057694',
  appId: '1:125483057694:web:9e11f464febe25465fa40f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
