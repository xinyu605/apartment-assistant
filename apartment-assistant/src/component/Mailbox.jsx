import React, { useEffect, useState } from "react";
import { MailList } from "./MailList";
import { UpdateMailList } from "./UpdateMailList";
import { getMailList } from "./../firebase";
import styles from "./MailList.module.scss";

/*****************************
 Mailbox component:
 1.Get data from Firestore
 2.Render 
******************************/

function Mailbox() {
  const [state, setState] = useState(false);
  const [untakenData, setUntakenData] = useState([]);
  const [takenData, setTakenData] = useState([]);

  // useEffect will run only after an initial render, and after an update on data is occurred
  useEffect(() => {
    getMailList(false).then((mailList) => {
      // console.log(mailList);
      setUntakenData(mailList);
    });
    getMailList(true).then((mailList) => {
      // console.log(mailList);
      setTakenData(mailList);
    });
  }, [state]); //[]內放需要監聽(有變動就要執行function)的state

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

  return (
    <div className={styles.mailBox}>
      <MailList
        state={state}
        untakenMails={untakenData}
        takenMails={takenData}
        toggleState={toggleState}
      />
      <UpdateMailList />
    </div>
  );
}

export default Mailbox;
