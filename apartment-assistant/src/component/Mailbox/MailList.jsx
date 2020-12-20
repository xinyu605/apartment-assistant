import React, { useEffect, useState } from "react";
import ConfirmMsg from "./../Common/ConfirmMsg";
import inboxUntaken from "./../../img/inboxUntaken.svg";
import inboxTaken from "./../../img/inboxTaken.svg";
import trashIcon from "./../../img/trash.svg";
import takeBox from "./../../img/takeBox.svg";
import noTakeBox from "./../../img/noTakeBox.svg";
import styles from "./MailList.module.scss";
import { showDate, scrollToTarget } from "./../../lib";
import { updateMailStatus } from "./../../firebase";

export function MailList(props) {
  const [newMail, setNewMail] = useState(props.newMail);
  const [showChangeStatusConfirm, setShowChangeStatusConfirm] = useState(false);
  const [changedMailId, setChangedMailId] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  // console.log(props);
  let lists = [];
  let headerImg;
  let stateController;
  let description;
  let receiveDate = "";

  if (props.state === false) {
    lists = props.untakenMails;
    headerImg = inboxUntaken;
    // stateController = "已領取";
    stateController = takeBox;
    description = "改為已領取";
  } else {
    lists = props.takenMails;
    headerImg = inboxTaken;
    // stateController = "未領取";
    stateController = noTakeBox;
    description = "改為未領取";
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
        {/* {list.receiver ? list.receiver.name : ""} */}
        <div className={`${styles.listTitle} ${styles.titleMailType}`}>
          類型
        </div>
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
            onClick={changeMailStatus}
          >
            <img src={stateController} title={description} />
          </button>
          <div
            className={styles.trashImg}
            id={`trash${index}`}
            onClick={props.deleteMail}
          >
            <img src={trashIcon} />
          </div>
        </div>
      </div>
    );
  });

  /****************************** 
    Change individual data status
  *******************************/

  function changeMailStatus(e) {
    // console.log(e.currentTarget.id);
    setChangedMailId(e.currentTarget.id);
    setShowChangeStatusConfirm(true);
    setConfirmMessage("是否確定更新領取狀態？");
  }

  function confirmChangeStatus(e) {
    e.preventDefault();
    let status;
    const mailId = changedMailId.slice(6);
    props.state ? (status = false) : (status = true);
    console.log(status);
    updateMailStatus(mailId, status);
    setShowChangeStatusConfirm(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowChangeStatusConfirm(false);
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
          <div className={styles.mailListTitle}>編號</div>
          <div className={styles.mailListTitle}>戶號</div>
          <div className={styles.mailListTitle}>收件人</div>
          <div className={styles.mailListTitle}>類型</div>
          <div className={styles.mailListTitle}>寄達日期</div>
          <div className={styles.mailListTitle}>位置</div>
          <div className={styles.mailListTitle}>備註</div>
          <div className={styles.mailListTitle}>修改</div>
        </div>
        {List}
      </div>
      <ConfirmMsg
        showConfirm={showChangeStatusConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmChangeStatus}
        cancelConfirm={cancelConfirm}
      />
    </div>
  );
}
