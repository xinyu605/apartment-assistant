import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  // useParams,   //nested router
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import logo from "./../img/logo.png";
import AskLogin from "./Common/AskLogin";
import Board from "./Board/Board";
import Resident from "./Resident/Resident";
import Mailbox from "./Mailbox/Mailbox";
import Field from "./Field/Field";
import styles from "./Admin.module.scss";
import firebase from "firebase";

let auth = firebase.auth();

export function Admin(props) {
  const match = useRouteMatch();
  const [isLogin, setLogin] = useState(undefined);

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
  }, []);

  return (
    <div className={styles.admin}>
      <div className={styles.topBar}>
        <div className={styles.smallLogoWrapper}>
          <img src={logo} />
        </div>
      </div>
      <AskLogin isLogin={isLogin} />
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
  function toggleSidebar(e) {
    console.log(e.currentTarget.id);
  }
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.imgWrapper}>
          <img src={logo} />
        </div>
      </div>
      <nav>
        <ul>
          <li className={styles.sidebarList}>
            <Link to="/admin">社區公告</Link>
          </li>
          <li className={styles.sidebarList}>
            <Link to="/admin/resident">住戶資訊</Link>
          </li>
          <li className={styles.sidebarList}>
            <Link to="/admin/mailbox">信件包裹紀錄</Link>
          </li>
          <li className={styles.sidebarList}>
            <Link to="/admin/field">場地租借紀錄</Link>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <div className={styles.copyright}>&copy; 2020 Apartment Assistant</div>
        <button id="logout" className={styles.logout} onClick={props.logout}>
          登出
        </button>
      </div>
      <div className={styles.toggleBtn} id="toggleBtn" onClick={toggleSidebar}>
        <span className={styles.hamburgerIcon}></span>
      </div>
    </div>
  );
}
