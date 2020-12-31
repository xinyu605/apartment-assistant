import React, { useEffect, useState } from "react";
import { MailList } from "./MailList";
import { UpdateMailList } from "./UpdateMailList";
import ScrollToTopBtn from "./../Common/ScrollToTopBtn";
import ConfirmMsg from "./../Common/ConfirmMsg";
import { getMailList, getResidentList, deleteDocById } from "./../../firebase";
import styles from "./MailList.module.scss";

export default function Mailbox() {
  const [state, setState] = useState(false);
  const [untakenData, setUntakenData] = useState([]);
  const [takenData, setTakenData] = useState([]);
  const [residentList, setResidentList] = useState([]);
  const [removeMailId, setRemoveMailId] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    getMailList(false, getUntakenData);
    function getUntakenData(untakenMails) {
      setUntakenData(untakenMails);
    }
    getMailList(true, getTakenData);
    function getTakenData(takenMails) {
      setTakenData(takenMails);
    }
  }, []);

  useEffect(() => {
    getResidentList(setResidentData);
    function setResidentData(residents) {
      setResidentList(residents);
    }
  }, []);

  function toggleState(e) {
    switch (e.currentTarget.id) {
      case "untakenBtn":
        setState(false);
        break;
      case "takenBtn":
        setState(true);
        break;
      default:
        break;
    }
  }

  function deleteMail(rmMailId) {
    setRemoveMailId(rmMailId);
    setShowDeleteConfirm(true);
    setConfirmMessage("刪除後無法復原，確定嗎？");
  }

  function confirmDelete(e) {
    e.preventDefault();

    if (state) {
      let mailList = [...takenData];
      mailList.filter((mail) => mail.mailId !== removeMailId);
      setTakenData(mailList);
    } else {
      let mailList = [...untakenData];
      mailList.filter((mail) => mail.mailId !== removeMailId);
      setUntakenData(mailList);
    }

    deleteDocById("mailbox", removeMailId);
    setShowDeleteConfirm(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowDeleteConfirm(false);
  }

  return (
    <div className={styles.mailBox}>
      <MailList
        state={state}
        untakenMails={untakenData}
        takenMails={takenData}
        toggleState={toggleState}
        deleteMail={deleteMail}
      />
      <UpdateMailList untakenMails={untakenData} residentList={residentList} />
      <ConfirmMsg
        showConfirm={showDeleteConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmDelete}
        cancelConfirm={cancelConfirm}
      />
      <ScrollToTopBtn />
    </div>
  );
}
