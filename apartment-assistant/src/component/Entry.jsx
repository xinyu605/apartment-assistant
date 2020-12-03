import React, { useState } from "react";
import styles from "./Entry.module.scss";
import mailbox from "./../img/inboxUntaken.svg";

export default function Entry(props) {
  return (
    <div className={styles.entry}>
      <h1>Welcome to Apartment Assistant!</h1>
      <div className={styles.issues}>
        <h2>社區公告</h2>
      </div>
      <div className={styles.mails}>
        <div className={styles.title}>
          <div className={styles.imgWrapper}>
            <div className={styles.number}>1</div>
            <img src={mailbox} />
          </div>
          <h2>信件包裹領取通知</h2>
        </div>

        <div>
          list
          <button className={styles.takenBtn}>已領取</button>
        </div>
      </div>
      <button className={styles.logout} onClick={props.logout}>
        登出
      </button>
    </div>
  );
}
