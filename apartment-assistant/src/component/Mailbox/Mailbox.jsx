import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  // useParams,   //nested router
  // useRouteMatch,
} from "react-router-dom";
import { MailList } from "./MailList";
import { UpdateMailList } from "./UpdateMailList";
import { getMailList, getResidentList, deleteMailData } from "./../../firebase";
import styles from "./MailList.module.scss";

/*****************************
 Mailbox component:
 1.Get data from Firestore
 2.Render 
******************************/

function Mailbox() {
  // const [isLogined, setLogin]=useState(undefined);
  const [state, setState] = useState(false);
  const [untakenData, setUntakenData] = useState([]);
  // const [untakenData, setUntakenData] = useState(getMailList(false));
  const [takenData, setTakenData] = useState([]);
  // const [takenData, setTakenData] = useState(getMailList(true));
  const [residentData, setResidentData] = useState([]);

  const [newMail, setNewMail] = useState(false);

  // useEffect will run only after an initial render, and after an update on data is occurred
  useEffect(() => {
    // console.log(getMailList(false));
    // setUntakenData(getMailList(false));
    // setTakenData(getMailList(true));
    getMailList(false).then((mailList) => {
      console.log(mailList);
      setUntakenData(mailList);
    });
    getMailList(true).then((mailList) => {
      // console.log(mailList);
      setTakenData(mailList);
    });
  }, [state]); //[]內放需要監聽(有變動就要執行function)的state

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    getResidentList().then((residentList) => {
      // console.log(residentList);
      if (isMounted) setResidentData(residentList);
    });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
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
    let ans = window.confirm("刪了就回不去囉！你確定？");
    if (ans) {
      const index = parseInt(e.currentTarget.id.slice(6));
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
    }
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
        residentList={residentData}
      />
    </div>
  );
}

export default Mailbox;
