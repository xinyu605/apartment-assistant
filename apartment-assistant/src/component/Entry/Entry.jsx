import React, { useState, useEffect } from "react";
import AskLogin from "./../Common/AskLogin";
import EntryMailList from "./EntryMailList";
import EntryMailRecord from "./EntryMailRecord";
import EntryBoard from "./EntryBoard";
import EntryField from "./EntryField";
import styles from "./Entry.module.scss";
import logo from "./../../img/logo.png";

import firebase from "firebase";
import { getUserMailList, getUserProfile } from "./../../firebase";

let auth = firebase.auth();
export default function Entry(props) {
  const [isLogin, setLogin] = useState(undefined);
  const [mailCount, setMailCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMailList, setUserMailList] = useState([]);
  const [userMailHistory, setUserMailHistory] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUserEmail(user.email);
        getUserProfile(user.uid).then((profile) => {
          setUserName(profile.userName);
        });
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
    getUserMailList(userEmail).then((mailList) => {
      // console.log(mailList);
      setUserMailList(mailList);
      setMailCount(mailList.length);
    });
    getUserMailList(userEmail, true).then((mailList) => {
      // console.log(mailList);
      setUserMailHistory(mailList);
    });
  }, [userEmail]);

  return (
    <div className={styles.entryPage}>
      <AskLogin isLogin={isLogin} />
      <div className={styles.entry}>
        <div className={styles.topBar}>
          <p>Hi! {userName}</p>
          <button className={styles.logout} onClick={props.logout}>
            登出
          </button>
        </div>
        <div className={styles.logoWrapper}>
          <img src={logo} />
        </div>
        <h1>Welcome to Apartment Assistant!</h1>
        <EntryBoard />
        <EntryMailList userMailList={userMailList} mailCount={mailCount} />
        <EntryMailRecord userMailHistory={userMailHistory} />
        <EntryField userName={userName} userEmail={userEmail} />
      </div>
    </div>
  );
}
