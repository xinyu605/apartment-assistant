import React, { useEffect, useState } from "react";
import { MailList } from "./MailList";
import { UpdateMailList } from "./UpdateMailList";
import ConfirmMsg from "./../Common/ConfirmMsg";
import { getMailList, getResidentList, deleteMailData } from "./../../firebase";
import styles from "./MailList.module.scss";

/*****************************
  Mailbox component:
  1.Get data from Firestore
  2.Render 
******************************/

export default function Mailbox() {
  const [state, setState] = useState(false);
  const [untakenData, setUntakenData] = useState([]);
  const [takenData, setTakenData] = useState([]);
  const [residentList, setResidentList] = useState([]);
  const [newMail, setNewMail] = useState(false);

  //confirm dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [deletedMailId, setDeletedMailId] = useState("");

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

  /****************************** 
    Delete individual mail
  *******************************/
  function deleteMail(e) {
    setShowDeleteConfirm(true);
    setConfirmMessage("刪除後無法復原，確定嗎？");
    setDeletedMailId(e.currentTarget.id.slice(6));
  }

  function confirmDelete(e) {
    e.preventDefault();
    const index = parseInt(deletedMailId);
    let mailList = [];
    let removedMail = [];
    if (state) {
      mailList = [...takenData];
      removedMail = mailList.splice(index, 1);
      setTakenData(mailList);
    } else {
      mailList = [...untakenData];
      removedMail = mailList.splice(index, 1);
      setUntakenData(mailList);
    }

    deleteMailData(removedMail[0].mailId);
    setShowDeleteConfirm(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowDeleteConfirm(false);
  }

  function updateNewMail() {
    newMail ? setNewMail(false) : setNewMail(true);
  }

  return (
    <div className={styles.mailBox}>
      <MailList
        state={state}
        untakenMails={untakenData}
        takenMails={takenData}
        toggleState={toggleState}
        deleteMail={deleteMail}
        newMail={newMail}
      />
      {/* <Route exact path="/admin/mailbox" component={UpdateMailList} /> */}
      <UpdateMailList
        updateNewMail={updateNewMail}
        residentList={residentList}
      />
      <ConfirmMsg
        showConfirm={showDeleteConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmDelete}
        cancelConfirm={cancelConfirm}
      />
    </div>
  );
}
