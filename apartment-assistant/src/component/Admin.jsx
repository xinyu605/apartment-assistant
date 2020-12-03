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
import logo from "./../img/logo.png";
import Mailbox from "./Mailbox";
import styles from "./../App.module.scss";
import firebase from "firebase";

let auth = firebase.auth();

export function Admin(props) {
  const [uid, setUid] = useState(props.uid);

  // auth.onAuthStateChanged(function (user) {
  //   if (user) {
  //     // console.log(auth.currentUser.uid);
  //     setUid(auth.currentUser.uid);
  //   }
  // });
  // const [isLogined, setLogin] = useState(false);
  // // console.log(props.uid);
  // useEffect(() => {
  //   if (props.uid) {
  //     setLogin(true);
  //     console.log(isLogined);
  //   } else {
  //     setLogin(false);
  //     console.log(isLogined);
  //   }
  // }, [isLogined]);
  // if (props.uid) {
  //   setLogin(true);
  // } else {
  //   setLogin(false);
  // }
  if (uid) {
    return (
      //  <Router>
      <Route exact path="/admin">
        <Sidebar logout={props.logout} />

        <Switch>
          <Route path="/admin/resident">
            <Resident />
          </Route>
          <Route path="/admin/mailbox" component={Mailbox} />
          {/* <Mailbox /> */}
          {/* </Route> */}
          <Route path="/admin/field">
            <Field />
          </Route>
          <Route path="/admin">
            <Board />
          </Route>
        </Switch>
      </Route>
      //  </Router>
    );
  } else {
    return <div>Please waiting...</div>;
  }
}

function Sidebar(props) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.imgWrapper}>
          <img src={logo} />
        </div>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/admin">社區公告</Link>
          </li>
          <li>
            <Link to="/admin/resident">住戶資訊</Link>
          </li>
          <li>
            <Link to="/admin/mailbox">信件包裹紀錄</Link>
          </li>
          <li>
            <Link to="/admin/field">場地租借紀錄</Link>
          </li>
        </ul>
      </nav>
      <button id="logout" onClick={props.logout}>
        登出
      </button>
    </div>
  );
}

function Resident() {
  return (
    <div>
      <h2>住戶資訊</h2>
    </div>
  );
}

function Field() {
  return (
    <div>
      <h2>場地租借紀錄</h2>
    </div>
  );
}

function Board() {
  return (
    <div>
      <h2>社區公告</h2>
    </div>
  );
}
