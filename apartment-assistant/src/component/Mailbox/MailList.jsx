import React, { useEffect, useState, useRef } from "react";
import MailListCard from "./MailListCard";
import ConfirmMsg from "./../Common/ConfirmMsg";
import inboxUntaken from "./../../img/inboxUntaken.svg";
import inboxTaken from "./../../img/inboxTaken.svg";
import takeBox from "./../../img/takeBox555.svg";
import noTakeBox from "./../../img/noTakeBox555.svg";
import styles from "./MailList.module.scss";
import { scrollToTarget } from "./../../utils/lib";
import { updateMailStatus } from "./../../firebase";

export function MailList(props) {
  const [showChangeStatusConfirm, setShowChangeStatusConfirm] = useState(false);
  const [changedMailId, setChangedMailId] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  let lists = [];
  let headerImg;
  let stateController;
  let description;

  if (props.state === false) {
    lists = props.untakenMails;
    headerImg = inboxUntaken;
    stateController = takeBox;
    description = "改為已領取";
  } else {
    lists = props.takenMails;
    headerImg = inboxTaken;
    stateController = noTakeBox;
    description = "改為未領取";
  }

  function changeMailStatus(e) {
    setChangedMailId(e.currentTarget.id);
    setShowChangeStatusConfirm(true);
    setConfirmMessage("是否確定更新領取狀態？");
  }

  function confirmChangeStatus(e) {
    e.preventDefault();
    let status;
    const mailId = changedMailId.slice(6);
    props.state ? (status = false) : (status = true);
    updateMailStatus(mailId, status);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowChangeStatusConfirm(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowChangeStatusConfirm(false);
  }

  return (
    <div className={styles.outerMailList}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={headerImg} />
          </div>
          <h3 className={styles.title}>信件包裹列表</h3>
        </div>

        <div className={styles.buttonBox} id="buttonBox">
          <div
            className={
              props.state
                ? `${styles.buttonBackground} ${styles.right}`
                : `${styles.buttonBackground} ${styles.left}`
            }
            id="buttonBackground"
          ></div>
          <div
            className={
              props.state
                ? `${styles.button} `
                : `${styles.button} ${styles.current}`
            }
            id="untakenBtn"
            onClick={props.toggleState}
          >
            未領取
          </div>
          <div
            className={
              props.state
                ? `${styles.button} ${styles.current}`
                : `${styles.button} `
            }
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
      <ListBody
        lists={lists}
        changeMailStatus={changeMailStatus}
        stateController={stateController}
        description={description}
        deleteMail={props.deleteMail}
      />
      <ConfirmMsg
        showConfirm={showChangeStatusConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmChangeStatus}
        cancelConfirm={cancelConfirm}
      />
    </div>
  );
}

function ListBody(props) {
  if (props.lists.length === 0) {
    return (
      <div className={styles.emptyMailList}>
        <div className={styles.imgWrapper}>
          <img src={inboxTaken} />
        </div>
        <div className={styles.emptyText}>目前沒有信件包裹紀錄</div>
        <div className={styles.circles}>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
        </div>
      </div>
    );
  } else {
    return (
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

        {props.lists.map((list) => {
          return (
            <MailListCard
              key={`mailListCard${list.mailId}`}
              list={list}
              changeMailStatus={props.changeMailStatus}
              stateController={props.stateController}
              description={props.description}
              deleteMail={props.deleteMail}
            />
          );
        })}
      </div>
    );
  }
}
