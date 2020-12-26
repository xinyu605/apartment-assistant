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

// Initialize Cloud Firestore through Firebase
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
  // let data = {
  //   name: "xinyu",
  //   email: "xinyuyan605@gmail.com",
  //   subject: "測試",
  //   content: "測試內容",
  // };
  let emailSender = functions.httpsCallable("emailSender");
  emailSender(data)
    .then((result) => {
      // console.log(result.data.text);
      console.log(result);
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      console.log(error.details);
    });
}

/*******************
  get user profile
 *******************/
export function getUserProfile(uid) {
  return users
    .doc(uid)
    .get()
    .then((doc) => {
      // console.log(doc.data());
      return doc.data();
    });
}

/*******************
  get Board list
 *******************/
// export function getBoardList() {
//   let data = [];
//   return refBoard
//     .get()
//     .then((docRef) => {
//       docRef.forEach((doc) => {
//         if (doc.id) {
//           data = [...data, doc.data()];
//           return data;
//         }
//       });
//       return data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

export function getBoardList(callback) {
  refBoard.onSnapshot((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
      data = [...data, doc.data()];
    });
    callback(data);
  });
}

/*********************************** 
  upload announcement on board
***********************************/
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
      console.log(docRef.id);
      refBoard.doc(docRef.id).set(
        {
          issueId: docRef.id,
        },
        { merge: true }
      );
      console.log("upload announcement successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

/***********************
  delete issue on board
 ***********************/
export function deleteIssueData(id) {
  refBoard
    .doc(id)
    .delete()
    .then(() => {
      console.log("delete issue successful");
    })
    .catch((error) => console.log(error));
}

/*******************
  get resident list
 *******************/
export function getResidentList(callback) {
  refResident.onSnapshot((querySnapshot) => {
    let data = [];
    querySnapshot.forEach((doc) => {
      data = [...data, doc.data()];
    });
    // console.log(data);
    callback(data);
  });
}

/*********************
  upload resident list
**********************/
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
      // console.log(docRef.id);

      refResident
        .doc(docRef.id)
        .set({ residentId: docRef.id }, { merge: true })
        .then(() => {
          console.log("add residentId successful");
        })
        .catch((error) => {
          console.log(error);
        });

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
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
  Delete resident and update residentList
*****************************************/
export function deleteResidentData(id) {
  refResident
    .doc(id)
    .delete()
    .then(() => {
      console.log("delete resident successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
  Edit resident and update residentList
*****************************************/
export function editUpdateResident(data) {
  console.log(data);
  refResident
    .doc(data.residentId)
    .update({
      residentNumbers: data.residentNumbers,
      floor: data.floor,
      address: data.address,
      remark: data.remark,
      familyMembers: data.familyMembers,
      updateDate: data.updateDate,
    })
    .then(() => {
      console.log("Update resident Info successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

/****************************************
  get untaken mailList and taken mailList
 ****************************************/
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

/****************************************
  get user's mailList
 ****************************************/
// export function getUserMailList(email, status = false) {
//   let data = [];
//   return refMailbox
//     .where("receiverEmail", "==", email)
//     .where("status", "==", status)
//     .get()
//     .then((docRef) => {
//       docRef.forEach((doc) => {
//         if (doc.id) {
//           data = [...data, doc.data()];
//           return data;
//         }
//       });
//       return data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

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

/****************************************
  Delete resident and update residentList
*****************************************/
export function deleteMailData(id) {
  refMailbox
    .doc(id)
    .delete()
    .then(() => {
      console.log("delete mail successful");
    })
    .catch((error) => {
      console.log(error);
    });
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

export function updateMailStatus(mailId, status) {
  return refMailbox
    .doc(mailId)
    .update({ status: status })
    .then(() => {
      console.log("update successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

/******************************** 
  get Field order lists
*********************************/
export function getExistedOrders(year, month, date, field, callback) {
  // console.log(year, month, date, field);

  refField
    .where("date", "==", `${year}${month}${date}`)
    .where("field", "==", field)
    .onSnapshot((querySnapshot) => {
      let data = [];
      querySnapshot.forEach((doc) => {
        data = [...data, doc.data()];
      });
      // console.log(data);
      callback(data);
    });
}

/******************************** 
  upload Field order lists
*********************************/
export function uploadFieldOrder(data) {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    refField
      .add(data[i])
      .then((docRef) => {
        refField.doc(docRef.id).set({ orderId: docRef.id }, { merge: true });
      })
      .then(() => {
        console.log("upload fieldList successful");
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

/********************* 
  Delete Field order
**********************/
export function deleteFieldOrder(id) {
  return refField
    .doc(id)
    .delete()
    .then(() => {
      console.log("delete order successful");
      return true;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

/******************************** 
  handle SignUp and SignIn
*********************************/

//native sign up and create user information in firestore
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
      // alert("註冊完成！請按確定繼續");
      return "success";
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      return error;
      // window.alert(`註冊失敗！請重新註冊 (Error: ${errorMessage})`);
      // console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
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
      return error;
      // window.alert(`登入失敗！請重新登入 (Error: ${errorMessage})`);
      // console.log("errorCode:", errorCode, "errorMessage:", errorMessage);
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
      return error;
    });
}
