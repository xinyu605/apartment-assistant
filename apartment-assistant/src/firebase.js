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
let auth = firebase.auth();
let refResident = db.collection("resident");
let refMailbox = db.collection("mailbox");
let users = db.collection("users");

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

export async function getReceiverInfo(residentNumbers, mailId) {
  let receiverData = [];
  try {
    let residential = await refResident
      .where("residentNumbers", "==", residentNumbers)
      .get();
    residential.forEach((doc) => {
      console.log("doc.id:", doc.id, "get data:", doc.data());
      refResident
        .doc(doc.id)
        .collection("familyMembers")
        .get()
        .then((docRef) => {
          docRef.forEach((doc) => {
            console.log("doc.id:", doc.id, "get data:", doc.data());
            receiverData = [...receiverData, doc.data()];
            return receiverData;
          });
        })
        .then(() => {
          console.log(receiverData);
          refMailbox
            .doc(mailId)
            .update({ familyMembers: receiverData })
            .then(() => {
              console.log("success to append familyMembers to receiver info!");
            });
        });
    });
  } catch (error) {
    console.log("Error getting documents", error);
  }
}

/****************************************
 upload new mail list to firestore
 ****************************************/
export function uploadMailList(data, mailId) {
  console.log(data);
  refMailbox
    .doc(mailId)
    .set(data)
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
 handle SignUp and SignIn
*********************************/

//native sign up and create user information in firestore
export function nativeSignUp(email, password, name) {
  auth
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
      alert("註冊完成！請按確定繼續");
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      window.alert(`註冊失敗！請重新註冊 (Error: ${errorMessage})`);
      console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    });
}

export function nativeSignIn(email, password) {
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("sign in successful!");
      if (email === "admin@apartment.com") {
        //管理員 密碼：apartment
        return "admin";
      } else {
        return "general";
      }
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      window.alert(`登入失敗！請重新登入 (Error: ${errorMessage})`);
      console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
    });
}

export function signInWithGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  return auth
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = result.credential.accessToken;
      // The signed-in user info.
      let user = result.user;
      if (user.email === "admin@apartment.com") {
        //管理員 密碼：apartment
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
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // The email of the user's account used.
      let email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      let credential = error.credential;
      console.log(error);
    });
}

/*
 check login
*/
export function checkLogin() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // console.log(auth.currentUser.uid);
      // setUid(auth.currentUser.uid);
      console.log(auth.currentUser.uid);
      return auth.currentUser.uid;
    } else {
      return false;
    }
  });
}

/*********************************** 
 get user's mail information by email
***********************************/
// function getMailInfoByEmail(email) {
//   refResident.where("");
// }
