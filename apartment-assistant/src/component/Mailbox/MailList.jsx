import React, { useEffect, useState } from "react";
import inboxUntaken from "./../../img/inboxUntaken.svg";
import inboxTaken from "./../../img/inboxTaken.svg";
import trashIcon from "./../../img/trash.svg";
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
    // console.log(list.mailId);
    const index = lists.indexOf(list);
    if (list.receiveDate) {
      receiveDate = showDate(list.receiveDate.seconds);
    }
    return (
      <div className={styles.list} id={`mail${index}`} key={list.mailId}>
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
        <div className={styles.mailBtns}>
          <button
            className={styles.status}
            id={`status${list.mailId}`}
            onClick={changeMailStatus}
          >
            {stateController}
          </button>
          <div
            className={styles.trashImg}
            id={`trash${index}`}
            onClick={props.deleteMail}
          >
            <img src={trashIcon} title={stateController} />
          </div>
        </div>
      </div>
    );
  });

  /****************************** 
    Change individual data status
  *******************************/

  function changeMailStatus(e) {
    console.log(e.currentTarget.id);
    let status;
    let ans = window.confirm("是否確定更新領取狀態？");
    if (ans) {
      const mailId = e.currentTarget.id.slice(6);
      props.state ? (status = false) : (status = true);
      console.log(status);
      updateMailStatus(mailId, status);
    }
  }

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
