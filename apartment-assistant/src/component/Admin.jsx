import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  // useParams,   //nested router
  useRouteMatch,
} from "react-router-dom";
import logo from "./../img/logo.png";
import Board from "./Board/Board";
import Resident from "./Resident/Resident";
import Mailbox from "./Mailbox/Mailbox";
import styles from "./../App.module.scss";
import firebase from "firebase";

let auth = firebase.auth();

export function Admin(props) {
  const match = useRouteMatch();

  return (
    <div className={styles.admin}>
      <Sidebar logout={props.logout} />

      <Switch>
        <Route path="/admin/resident">
          <Resident />
        </Route>
        <Route path={`${match.path}/mailbox`}>
          <Mailbox />
        </Route>
        <Route path="/admin/field">
          <Field />
        </Route>
        <Route path="/admin">
          <Board />
        </Route>
      </Switch>
    </div>
  );
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
      <button id="logout" className={styles.logout} onClick={props.logout}>
        登出
      </button>
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
