import firebase from "firebase";
import Gathering from "../gathering"
const firebaseConfig = {
  apiKey: "AIzaSyAUTMALT3Qajv-H6fMdhQR4Lh6X3L0Ren4",
  authDomain: "whatsapp-clone-ebdd6.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-ebdd6-default-rtdb.firebaseio.com",
  projectId: "whatsapp-clone-ebdd6",
  storageBucket: "whatsapp-clone-ebdd6.appspot.com",
  messagingSenderId: "689019693282",
  appId: "1:689019693282:web:9853ccb09d07f9f9ed16bb"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider(); //for auth signup
// default/global gathering
const onlineUsers = new Gathering(firebase.database());

// Create an isolated space
// const chatroom = new Gathering(firebase.database(), 'Special Name');

// onlineUsers.join();

onlineUsers.onUpdated(function(count, users) {
  console.log('We have '+ count +' members online right now.');
  console.log('Here is the updated users list -');
  for(var i in users) {
      console.log(users[i] + '(id: '+ i + ')');
  }
});

export { auth, provider, onlineUsers };
export default db;
