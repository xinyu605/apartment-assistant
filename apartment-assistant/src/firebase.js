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
let refResident = db.collection("resident");
let refMailbox = db.collection("mailbox");

/*******************
 get resident list
 *******************/
export function getResidentList() {
  refResident
    .get()
    .then((docRef) => {
      docRef.forEach((doc) => {
        if (doc.id) {
          console.log(doc.data());
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
 get untaken mailList and taken mailList
 ****************************************/
export function getMailList(status = false) {
  let data = [];
  return refMailbox
    .where("status", "==", status) //status= true (taken) | false (untaken)
    .orderBy("mailNumbers", "asc")
    .get()
    .then((docRef) => {
      console.log(docRef);
      docRef.forEach((doc) => {
        if (doc.id) {
          data = [...data, doc.data()];
          return data;
        }
      });
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

/********************************************************************************************
 get receiver's familyMembers from resident document and append to assigned mailList document
 ********************************************************************************************/
export function getReceiverInfo(residentNumbers, mailId) {
  let receiverData = null;
  refResident
    .where("residentNumbers", "==", residentNumbers)
    .get()
    .then((docRef) => {
      docRef.forEach((doc) => {
        if (doc.id) {
          // console.log("doc.id", doc.id, "doc.data()", doc.data());
          receiverData = doc.data();
        }
      });
    })
    .then(() => {
      console.log(receiverData);
      refMailbox
        .doc(mailId)
        .set(
          {
            familyMembers: receiverData.familyMembers,
          },
          { merge: true }
        )
        .then(() => {
          console.log("success to append familyMembers to receiver info!");
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
 upload new mail list to firestore
 ****************************************/
export function uploadMailList(data) {
  console.log(data);
  refMailbox
    .add(data)
    .then(() => {
      console.log("add data successful!");
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
 turn time into firebase timeStamp
 ****************************************/
export function getTimeStamp(year, month, date) {
  const timeStamp = firebase.firestore.Timestamp.fromDate(
    new Date(year, month - 1, date)
  );
  // console.log(timeStamp);
  return timeStamp;
}

/****************************************
 update mail status (true ←→ false )
 ****************************************/
export function updateMailStatus(number, status) {
  return refMailbox
    .where("mailNumbers", "==", number)
    .get()
    .then((docRef) => {
      docRef.forEach((doc) => {
        if (doc.id) {
          refMailbox.doc(doc.id).update({
            status: status,
          });
        }
      });
      console.log("update successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

/******************************** 
 handle Native SignUp and SignIn
*********************************/
export function nativeSignUp(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("sign up successful!");
      console.log(user);
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    });
}

export function nativeSignIn(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log("sign in successful!");
      console.log(user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    });
}

export function checkUserSignInOrNot() {
  const user = firebase.auth().currentUser;
  if (user) {
    console.log(`user is signed in, uid: ${user.uid}`);
    return user.uid;
  } else {
    console.log("no user is signed in");
    return false;
  }
}
