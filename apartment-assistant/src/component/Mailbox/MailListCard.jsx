import React from "react";
import styles from "./MailList.module.scss";
import { showDate } from "./../../utils/lib";
import trashIcon from "./../../img/trash555.svg";
import takeBox from "./../../img/takeBox555.svg";
import noTakeBox from "./../../img/noTakeBox555.svg";

export default function MailListCard(props) {
  let list = props.list;
  let receiveDate = "";
  if (list.receiveDate) {
    receiveDate = showDate(list.receiveDate.seconds);
  }
  return (
    <div className={styles.list} id={`mail${list.mailId}`} key={list.mailId}>
      <div className={`${styles.listTitle} ${styles.titleMailNumbers}`}>
        編號
      </div>
      <div className={`${styles.listItems} ${styles.itemMailNumbers}`}>
        {list.mailNumbers}
      </div>
      <div className={`${styles.listTitle} ${styles.titleResidentNumbers}`}>
        戶號
      </div>
      <div className={`${styles.listItems} ${styles.itemResidentNumbers}`}>
        {list.residentNumbers}
        {/* {list.receiver ? list.receiver.residentNumbers : ""} */}
      </div>
      <div className={`${styles.listTitle} ${styles.titleReceiverName}`}>
        收件人
      </div>
      <div className={`${styles.listItems} ${styles.itemReceiverName}`}>
        {list.receiverName}
      </div>
      <div className={`${styles.listTitle} ${styles.titleMailType}`}>類型</div>
      <div className={`${styles.listItems} ${styles.itemMailType}`}>
        {list.mailType}
      </div>
      <div className={`${styles.listTitle} ${styles.titleReceiveDate}`}>
        寄達日期
      </div>
      <div className={`${styles.listItems} ${styles.itemReceiveDate}`}>
        {receiveDate}
      </div>
      <div className={`${styles.listTitle} ${styles.titlePlace}`}>位置</div>
      <div className={`${styles.listItems} ${styles.itemPlace}`}>
        {list.place}
      </div>
      <div className={`${styles.listTitle} ${styles.titleRemark}`}>備註</div>
      <div className={`${styles.listItems} ${styles.itemRemark}`}>
        {list.remark}
      </div>
      <div className={styles.mailBtns}>
        <button
          className={styles.status}
          id={`status${list.mailId}`}
          onClick={props.changeMailStatus}
        >
          <img
            src={props.state ? noTakeBox : takeBox}
            alt=""
            title={props.state ? "改為未領取" : "改為已領取"}
          />
        </button>
        <div
          className={styles.trashImg}
          onClick={() => {
            props.deleteMail(list.mailId);
          }}
        >
          <img src={trashIcon} />
        </div>
      </div>
    </div>
  );
}
