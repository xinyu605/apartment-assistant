import React, { useState, useEffect } from "react";
import AskLogin from "./../Common/AskLogin";
import ScrollToTopBtn from "./../Common/ScrollToTopBtn";
import EntryMailList from "./EntryMailList";
import EntryMailRecord from "./EntryMailRecord";
import EntryBoard from "./EntryBoard";
import EntryField from "./EntryField";
import styles from "./Entry.module.scss";
import logo from "./../../img/logo_apartment.png";
import announceIcon from "./../../img/promotion.svg";
import mailbox from "./../../img/inboxUntaken.svg";
import list from "./../../img/list.svg";
import calendarIcon from "./../../img/calendar.svg";
import firebase from "firebase";
import { getUserMailList, getUserProfile } from "./../../firebase";
import { scrollToTarget } from "../../lib";

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

    getUserMailList(userEmail, false, getMailListData);
    function getMailListData(mailList) {
      setUserMailList(mailList);
      setMailCount(mailList.length);
    }

    getUserMailList(userEmail, true, getMailHistory);
    function getMailHistory(mailList) {
      setUserMailHistory(mailList);
    }
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
        <div className={styles.cards}>
          <div
            className={`${styles.card} ${styles.cardBoard}`}
            onClick={() => {
              scrollToTarget("issues");
            }}
          >
            <div className={styles.imgWrapper}>
              <img src={announceIcon} />
            </div>
            <h2 className={styles.cardTitle}>社區公告</h2>
          </div>
          <div
            className={`${styles.card} ${styles.cardMailList}`}
            onClick={() => {
              scrollToTarget("mailList");
            }}
          >
            <div className={styles.imgWrapper}>
              <img src={mailbox} />
            </div>
            <h2 className={styles.cardTitle}>
              信件包裹
              <br />
              領取通知
            </h2>
          </div>{" "}
          <div
            className={`${styles.card} ${styles.cardMailHistory}`}
            onClick={() => {
              scrollToTarget("mailHistory");
            }}
          >
            <div className={styles.imgWrapper}>
              <img src={list} />
            </div>
            <h2 className={styles.cardTitle}>
              信件包裹
              <br />
              領取紀錄
            </h2>
          </div>{" "}
          <div
            className={`${styles.card} ${styles.cardField}`}
            onClick={() => {
              scrollToTarget("fieldRecord");
            }}
          >
            <div className={styles.imgWrapper}>
              <img src={calendarIcon} />
            </div>
            <h2 className={styles.cardTitle}>場地租借</h2>
          </div>
        </div>
        <EntryBoard />
        <EntryMailList userMailList={userMailList} mailCount={mailCount} />
        <EntryMailRecord userMailHistory={userMailHistory} />
        <EntryField userName={userName} userEmail={userEmail} />
        <ScrollToTopBtn />
      </div>
    </div>
  );
}
