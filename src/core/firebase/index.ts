import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const apiKey = process.env.EXPO_PUBLIC_API_APIKEY;
const authDomain = process.env.EXPO_PUBLIC_API_AUTHDOMAIN;
const projectId = process.env.EXPO_PUBLIC_API_PROJECTID;
const storageBucket = process.env.EXPO_PUBLIC_API_STORAGEBUCKET;
const messagingSenderId = process.env.EXPO_PUBLIC_API_MESSAGINGSENDERID;
const appId = process.env.EXPO_PUBLIC_API_APPID;
export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

let firestore: any;
let auth: any;
let storage: any;

if (firebase !== null && firebase?.apps?.length === 0) {
  const app = firebase.initializeApp(firebaseConfig);
  firestore = firebase?.firestore(app);
  auth = firebase?.auth(app);
  storage = firebase?.storage(app);
} else {
  firestore = firebase.firestore();
  auth = firebase.auth();
  storage = firebase.storage();
}

export { firestore, auth, storage, firebase };
