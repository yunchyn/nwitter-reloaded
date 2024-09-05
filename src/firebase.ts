import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa7nxfBpwMc-5GO0UTQpv9xdaP-9urwNw",
  authDomain: "nwitter-reloaded-70dde.firebaseapp.com",
  projectId: "nwitter-reloaded-70dde",
  storageBucket: "nwitter-reloaded-70dde.appspot.com",
  messagingSenderId: "94019441073",
  appId: "1:94019441073:web:6f07c99af071778269ed90",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
