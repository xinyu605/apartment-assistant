import React, { useEffect, useState } from "react";
import inboxUntaken from "./../../img/inboxUntaken.svg";
import inboxTaken from "./../../img/inboxTaken.svg";
import styles from "./MailList.module.scss";
import { showDate, scrollToTarget } from "./../../lib";
import { updateMailStatus } from "./../../firebase";

export function MailList(props) {
  const [newMail, setNewMail] = useState(props.newMail);
  // console.log(props);
  let lists = [];
  let headerImg;
  let stateController;
  let receiveDate = "";

  if (props.state === false) {
    lists = props.untakenMails;
    headerImg = inboxUntaken;
    stateController = "已領取";
  } else {
    lists = props.takenMails;
    headerImg = inboxTaken;
    stateController = "未領取";
  }
  // console.log(props.state);
  // console.log(lists);
  const List = lists.map((list) => {
    if (list.receiveDate) {
      receiveDate = showDate(list.receiveDate.seconds);
    }
    return (
      <div className={styles.list} key={list.mailId}>
        <div className="mailNumbers">{list.mailNumbers}</div>
        <div className="residentNumber">
          {list.residentNumbers}
          {/* {list.receiver ? list.receiver.residentNumbers : ""} */}
        </div>
        <div className="receiverName">{list.receiverName}</div>
        {/* {list.receiver ? list.receiver.name : ""} */}
        <div className="mailType">{list.mailType}</div>
        <div className="receiveDate">{receiveDate}</div>
        <div className="place">{list.place}</div>
        <div className="remark">{list.remark}</div>
        <button className={styles.status} id={`status${list.mailId}`}>
          {stateController}
        </button>
      </div>
    );
  });

  /****************************** 
   Change individual data status
  *******************************/
  useEffect(() => {
    const mailList = document.querySelector("#mailList");
    // const listItems = mailList.querySelectorAll(`.${styles.list}`);
    // console.log(listItems);
    const statusButtons = mailList.querySelectorAll(".status");
    let status = [];
    for (let i = 0; i < statusButtons.length; i++) {
      statusButtons[i].addEventListener("click", () => {
        let ans = confirm("是否確定更新領取狀態？");
        if (ans) {
          const number = parseInt(statusButtons[i].id.slice(6));
          props.state ? (status[i] = false) : (status[i] = true);
          updateMailStatus(number, status[i]);
          // window.location.href = "./mailbox";
        }
      });
    }
  }, [props]);

  /*************************************** 
   Toggle "未領取" "已領取" controller 外觀 
  ****************************************/
  useEffect(() => {
    const untakenBtn = document.querySelector("#untakenBtn");
    const takenBtn = document.querySelector("#takenBtn");
    const buttonBackground = document.querySelector("#buttonBackground");
    untakenBtn.addEventListener("click", () => {
      takenBtn.classList.remove(styles.current);
      untakenBtn.classList.add(styles.current);
      buttonBackground.classList.remove(styles.right);
      buttonBackground.classList.add(styles.left);
    });
    takenBtn.addEventListener("click", () => {
      untakenBtn.classList.remove(styles.current);
      takenBtn.classList.add(styles.current);
      buttonBackground.classList.remove(styles.left);
      buttonBackground.classList.add(styles.right);
    });
  }, [props.state]);

  return (
    <div className={styles.outerMailList}>
      {/* list header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={headerImg} />
          </div>
          <h3 className={styles.title}>信件包裹列表</h3>
        </div>

        <div className={styles.buttonBox} id="buttonBox">
          <div
            className={`${styles.buttonBackground} ${styles.left}`}
            id="buttonBackground"
          ></div>
          <div
            className={`${styles.button} ${styles.current}`}
            id="untakenBtn"
            onClick={props.toggleState}
          >
            未領取
          </div>
          <div
            className={styles.button}
            id="takenBtn"
            onClick={props.toggleState}
          >
            已領取
          </div>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => {
            scrollToTarget("updateMailList");
          }}
        >
          新增
        </button>
      </div>
      {/* list body */}
      <div className={styles.mailList} id="mailList">
        <div className={styles.tableTitle}>
          <div className="mailNumbers">編號</div>
          <div className="residentNumber">戶號</div>
          <div className="receiver">收件人</div>
          <div className="mailType">信件包裹類型</div>
          <div className="receiveDate">寄達日期</div>
          <div className="place">位置</div>
          <div className="remark">備註</div>
          <div className="status">狀態變更</div>
        </div>
        {List}
      </div>
    </div>
  );
}
