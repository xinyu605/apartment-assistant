import React from "react";
import { showDate } from "./../../lib";
import { nanoid } from "nanoid";
import styles from "./EntryMailList.module.scss";
import mailbox from "./../../img/inboxUntaken.svg";

export default function EntryMailList(props) {
  let receiveDate = "";

  const MailDetail = props.userMailList.map((list) => {
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
        {/* <button className={styles.takenBtn}>已領取</button> */}
      </div>
    );
  });

  return (
    <div className={styles.mails} id="mailList">
      <div className={styles.title}>
        <div className={styles.imgWrapper}>
          <div className={styles.number}>{props.mailCount}</div>
          <img src={mailbox} />
        </div>
        <h2>信件包裹領取通知</h2>
      </div>
      <div className={styles.userMailList}>{MailDetail}</div>
    </div>
  );
}
