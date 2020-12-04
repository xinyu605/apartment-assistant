import React, { useState, useEffect } from "react";
import styles from "./Entry.module.scss";
import logo from "./../img/logo.png";
import mailbox from "./../img/inboxUntaken.svg";
import list from "./../img/list.svg";
import firebase from "firebase";
import { getUserMailList, getUserProfile } from "./../firebase";
import { nanoid } from "nanoid";
import { showDate } from "./../lib";

let auth = firebase.auth();
export default function Entry(props) {
  const [mailCount, setMailCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMailList, setUserMailList] = useState([]);
  const [userMailHistory, setUserMailHistory] = useState([]);
  let receiveDate = "";

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUserEmail(user.email);
        getUserProfile(user.uid).then((profile) => {
          setUserName(profile.userName);
        });
      }
    });
    getUserMailList(userEmail).then((mailList) => {
      console.log(mailList);
      setUserMailList(mailList);
      setMailCount(mailList.length);
    });
    getUserMailList(userEmail, true).then((mailList) => {
      console.log(mailList);
      setUserMailHistory(mailList);
    });
  }, [userEmail]);

  const MailDetail = userMailList.map((list) => {
    if (list.receiveDate) {
      receiveDate = showDate(list.receiveDate.seconds);
    }
    return (
      <div className={styles.userMail} key={nanoid()}>
        <div className={`${styles.title} ${styles.title1}`}>編號</div>
        <div className={`${styles.content} ${styles.content1}`}>
          {list.mailNumbers}
        </div>
        <div className={`${styles.title} ${styles.title2}`}>類型</div>
        <div className={`${styles.content} ${styles.content2}`}>
          {list.mailType}
        </div>
        <div className={`${styles.title} ${styles.title3}`}>位置</div>
        <div className={`${styles.content} ${styles.content3}`}>
          {list.place}
        </div>
        <div className={`${styles.title} ${styles.title4}`}>寄達日期</div>
        <div className={`${styles.content} ${styles.content4}`}>
          {receiveDate}
        </div>
        <div className={`${styles.title} ${styles.title5}`}>收件人</div>
        <div className={`${styles.content} ${styles.content5}`}>
          {list.receiverName}
        </div>
        <button className={styles.takenBtn}>已領取</button>
      </div>
    );
  });

  const MailHistoryDetail = userMailHistory.map((list) => {
    if (list.receiveDate) {
      receiveDate = showDate(list.receiveDate.seconds);
    }
    return (
      <div className={styles.userMailHistory} key={nanoid()}>
        <div className={`${styles.title} ${styles.title1}`}>編號</div>
        <div className={`${styles.content} ${styles.content1}`}>
          {list.mailNumbers}
        </div>
        <div className={`${styles.title} ${styles.title2}`}>類型</div>
        <div className={`${styles.content} ${styles.content2}`}>
          {list.mailType}
        </div>
        <div className={`${styles.title} ${styles.title3}`}>位置</div>
        <div className={`${styles.content} ${styles.content3}`}>
          {list.place}
        </div>
        <div className={`${styles.title} ${styles.title4}`}>寄達日期</div>
        <div className={`${styles.content} ${styles.content4}`}>
          {receiveDate}
        </div>
        <div className={`${styles.title} ${styles.title5}`}>收件人</div>
        <div className={`${styles.content} ${styles.content5}`}>
          {list.receiverName}
        </div>
      </div>
    );
  });

  return (
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
      <div className={styles.issues}>
        <h2>社區公告</h2>
      </div>
      <div className={styles.mails}>
        <div className={styles.title}>
          <div className={styles.imgWrapper}>
            <div className={styles.number}>{mailCount}</div>
            <img src={mailbox} />
          </div>
          <h2>信件包裹領取通知</h2>
        </div>
        <div className={styles.userMailList}>{MailDetail}</div>
      </div>

      <div className={styles.mails}>
        <div className={styles.title}>
          <div className={styles.imgWrapper}>
            <img src={list} />
          </div>
          <h2>信件包裹領取紀錄</h2>
        </div>

        <div className={styles.userMailList}>{MailHistoryDetail}</div>
      </div>
    </div>
  );
}
