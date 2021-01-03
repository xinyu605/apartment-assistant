import React, { useState } from "react";
import MailListCard from "./MailListCard";
import ConfirmMsg from "./../Common/ConfirmMsg";
import inboxUntaken from "./../../img/inboxUntaken.svg";
import inboxTaken from "./../../img/inboxTaken.svg";
import styles from "./MailList.module.scss";
import { scrollToTarget } from "./../../utils/lib";
import { updateMailStatus } from "./../../firebase";

export function MailList(props) {
  const [showChangeStatusConfirm, setShowChangeStatusConfirm] = useState(false);
  const [changedMailId, setChangedMailId] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  let lists = props.state ? props.takenMails : props.untakenMails;

  function changeMailStatus(e) {
    setChangedMailId(e.currentTarget.id);
    setShowChangeStatusConfirm(true);
    setConfirmMessage("是否確定更新領取狀態？");
  }

  function confirmChangeStatus(e) {
    e.preventDefault();
    let status = props.state ? false : true;
    const mailId = changedMailId.slice(6);
    updateMailStatus(mailId, status);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowChangeStatusConfirm(false);
  }

  return (
    <div className={styles.outerMailList}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={props.state ? inboxTaken : inboxUntaken} />
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
        state={props.state}
        deleteMail={props.deleteMail}
      />
      {showChangeStatusConfirm && (
        <ConfirmMsg
          confirmMessage={confirmMessage}
          confirmAction={confirmChangeStatus}
          cancelConfirm={() => {
            setShowChangeStatusConfirm(false);
          }}
        />
      )}
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
              state={props.state}
              changeMailStatus={props.changeMailStatus}
              deleteMail={props.deleteMail}
            />
          );
        })}
      </div>
    );
  }
}
