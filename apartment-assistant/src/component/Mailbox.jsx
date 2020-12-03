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
import { getMailList, getResidentList } from "./../firebase";
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
  const [takenData, setTakenData] = useState([]);
  const [residentData, setResidentData] = useState([]);

  const [newMail, setNewMail] = useState(false);

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

  useEffect(() => {
    getResidentList().then((residentList) => {
      // console.log(residentList);
      setResidentData(residentList);
    });
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
