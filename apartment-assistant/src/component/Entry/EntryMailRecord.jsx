import React from "react";
import { nanoid } from "nanoid";
import { showDate } from "./../../utils/lib";
import styles from "./EntryMailRecord.module.scss";
import list from "./../../img/list.svg";

export default function EntryMailRecord(props) {
  let receiveDate = "";

  const MailHistoryDetail = props.userMailHistory.map((list) => {
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
    <div className={styles.mails} id="mailHistory">
      <div className={styles.title}>
        <div className={styles.imgWrapper}>
          <img src={list} />
        </div>
        <h2>信件包裹領取紀錄</h2>
      </div>

      <div className={styles.userMailList}>{MailHistoryDetail}</div>
    </div>
  );
}
