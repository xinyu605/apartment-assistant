import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyDl0B2I0o0r4mptX5VyvBmZVChAXqCgnCE",
  authDomain: "apartment-assistant-project.firebaseapp.com",
  databaseURL: "https://apartment-assistant-project.firebaseio.com",
  projectId: "apartment-assistant-project",
  storageBucket: "apartment-assistant-project.appspot.com",
  messagingSenderId: "532715045672",
  appId: "1:532715045672:web:429583f6da1bcd4b6e461d",
  measurementId: "G-W0TFBHTCR0",
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export function setFirestore() {
  let ref = db.collection("mailbox").doc("mail");

  ref
    .set({
      date: "2020-11-25",
      receiver: "Xinyu",
      test: "test189",
    })
    .then(() => {
      console.log("set data successful");
    });
}

export function getmailList() {
  let ref = db.collection("mailbox");
  console.log(ref);
  ref.get().then((docRef) => {
    console.log(docRef);
    docRef.forEach((doc) => {
      if (doc.id) {
        console.log(doc.id, doc.data().receiver);
      }
    });
  });
}
