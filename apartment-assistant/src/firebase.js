import firebase from "firebase";
import "firebase/functions";

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

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
let auth = firebase.auth();
let functions = firebase.functions();
let refBoard = db.collection("board");
let refResident = db.collection("resident");
let refMailbox = db.collection("mailbox");
let users = db.collection("users");
let refField = db.collection("field");

/***********************************************************************
  call Firebase cloud function: emailSender (自定義，檔案在 src/index.js)
 ***********************************************************************/
export function sendMail(data) {
  let emailSender = functions.httpsCallable("emailSender");
  emailSender(data);
}

export function transferToFirebaseTimeStamp(year, month, date) {
  const timeStamp = firebase.firestore.Timestamp.fromDate(
    new Date(year, month - 1, date)
  );
  return timeStamp;
}

export function getUserProfile(uid) {
  return users
    .doc(uid)
    .get()
    .then((doc) => {
      return doc.data();
    });
}

export function getBoardList(callback) {
  refBoard.onSnapshot((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
      data = [...data, doc.data()];
    });
    callback(data);
  });
}

export function getResidentList(callback) {
  refResident.orderBy("residentNumbers").onSnapshot((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
      data = [...data, doc.data()];
    });
    callback(data);
  });
}

export function getMailList(status = false, callback) {
  refMailbox
    .where("status", "==", status) //status= true (taken) | false (untaken)
    .orderBy("mailNumbers", "asc")
    .onSnapshot(function (querySnapshot) {
      let data = [];
      querySnapshot.forEach((doc) => {
        data = [...data, doc.data()];
      });
      callback(data);
    });
}

export function getUserMailList(email, status = false, callback) {
  return refMailbox
    .where("receiverEmail", "==", email)
    .where("status", "==", status)
    .onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data = [...data, doc.data()];
      });
      callback(data);
    });
}

export function getExistedOrders(year, month, date, field, callback) {
  refField
    .where("date", "==", `${year}${month}${date}`)
    .where("field", "==", field)
    .onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data = [...data, doc.data()];
      });
      callback(data);
    });
}

export function deleteDocById(collection, id) {
  let ref;
  switch (collection) {
    case "board":
      ref = refBoard;
      break;
    case "residents":
      ref = refResident;
      break;
    case "mailbox":
      ref = refMailbox;
      break;
    case "field":
      ref = refField;
      break;
    default:
      break;
  }
  return ref.doc(id).delete();
}

export function updateDocById(collection, id, data) {
  let ref;
  switch (collection) {
    case "board":
      ref = refBoard;
      break;
    case "residents":
      ref = refResident;
      break;
    default:
      break;
  }
  return ref
    .doc(id)
    .update(data)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
}

export function updateMailStatus(mailId, status) {
  return refMailbox.doc(mailId).update({ status: status });
}

export function uploadAnnouncement(data) {
  refBoard
    .add({
      topic: data.topic,
      author: data.author,
      updateTime: data.updateTime,
      deadline: data.deadline,
      content: data.content,
    })
    .then((docRef) => {
      refBoard.doc(docRef.id).set(
        {
          issueId: docRef.id,
        },
        { merge: true }
      );
    });
}

export function uploadResident(data) {
  refResident
    .add({
      residentNumbers: data.residentNumbers,
      floor: data.floor,
      address: data.address,
      remark: data.remark,
      familyMembers: data.familyMembers,
      updateDate: data.updateDate,
    })
    .then((docRef) => {
      refResident
        .doc(docRef.id)
        .set({ residentId: docRef.id }, { merge: true });

      for (let i = 0; i < data.familyMembers.length; i++) {
        refResident
          .doc(docRef.id)
          .collection("familyMembers")
          .doc(data.familyMembers[i].memberId)
          .set(
            {
              memberId: data.familyMembers[i].memberId,
              name: data.familyMembers[i].name,
              phone: data.familyMembers[i].phone,
              email: data.familyMembers[i].email,
            },
            { merge: true }
          );
      }
    });
}

export function uploadMailList(data, mailId) {
  refMailbox.doc(mailId).set(data);
}

export function uploadFieldOrder(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    refField.add(data[i]).then((docRef) => {
      refField.doc(docRef.id).set({ orderId: docRef.id }, { merge: true });
    });
  }
}

export function nativeSignUp(email, password, name) {
  return auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log("sign up successful!, userID:", auth.currentUser.uid);
      const signUpTime = new Date();
      users.doc(auth.currentUser.uid).set({
        userName: name,
        signUpTime: signUpTime,
        email: auth.currentUser.email,
        userId: auth.currentUser.uid,
      });
      return "success";
    })
    .catch((error) => {
      return error;
    });
}

export function nativeSignIn(email, password) {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("sign in successful!");
      if (email === "admin@apartment.com") {
        return "admin";
      } else {
        return "general";
      }
    })
    .catch((error) => {
      return error;
    });
}

export function signInWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return auth
    .signInWithPopup(provider)
    .then(function (result) {
      let user = result.user;
      if (user.email === "admin@apartment.com") {
        return "admin";
      } else {
        const signUpTime = new Date();
        users.doc(user.uid).set({
          userName: user.displayName,
          signUpTime: signUpTime,
          email: user.email,
          userId: user.uid,
        });
        return "general";
      }
    })
    .catch(function (error) {
      return error;
    });
}
