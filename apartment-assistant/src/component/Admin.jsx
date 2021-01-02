import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import logo from "./../img/logo_apartment.png";
import AskLogin from "./Common/AskLogin";
import Board from "./Board/Board";
import Resident from "./Resident/Resident";
import Mailbox from "./Mailbox/Mailbox";
import Field from "./Field/Field";
import styles from "./Admin.module.scss";
import firebase from "firebase";
import logout from "./../img/logout.svg";

let auth = firebase.auth();

export function Admin(props) {
  const match = useRouteMatch();
  const [isLogin, setLogin] = useState(undefined);
  const [isShowing, setShowing] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setUserEmail(user.email);
        setLogin(true);
      } else {
        setLogin(false);
      }
    });
  }, []);

  function toggleSidebar() {
    if (isShowing) {
      setShowing(false);
    } else {
      setShowing(true);
    }
  }

  return (
    <div className={styles.admin}>
      <div className={styles.topBar}>
        <div
          className={
            isShowing
              ? `${styles.toggleBtn}`
              : `${styles.toggleBtn} ${styles.open}`
          }
          id="toggleBtn"
          onClick={toggleSidebar}
        >
          <span className={styles.hamburgerIcon} id="hamburger1"></span>
          <span className={styles.hamburgerIcon} id="hamburger2"></span>
          <span className={styles.hamburgerIcon} id="hamburger3"></span>
          <span className={styles.hamburgerIcon} id="hamburger4"></span>
        </div>
      </div>
      <AskLogin isLogin={isLogin} />
      <Sidebar isShowing={isShowing} logout={props.logout} />

      <Switch>
        <Route path="/admin/resident">
          <Resident />
        </Route>
        <Route path={`${match.path}/mailbox`}>
          <Mailbox />
        </Route>
        <Route path="/admin/field">
          <Field userEmail={userEmail} />
        </Route>
        <Route path="/admin">
          <Board />
        </Route>
      </Switch>
    </div>
  );
}

function Sidebar(props) {
  let location = useLocation();
  const linkBoard = useRef(null);
  const linkResident = useRef(null);
  const linkMailbox = useRef(null);
  const linkField = useRef(null);

  useEffect(() => {
    linkBoard.current.style.borderRight = "transparent";
    linkResident.current.style.borderRight = "transparent";
    linkMailbox.current.style.borderRight = "transparent";
    linkField.current.style.borderRight = "transparent";
    if (location.pathname === "/admin/resident") {
      linkResident.current.style.borderRight =
        "10px solid rgba(44, 102, 110, 0.3)";
    } else if (location.pathname === "/admin/mailbox") {
      linkMailbox.current.style.borderRight =
        "10px solid rgba(44, 102, 110, 0.3)";
    } else if (location.pathname === "/admin/field") {
      linkField.current.style.borderRight =
        "10px solid rgba(44, 102, 110, 0.3)";
    } else {
      linkBoard.current.style.borderRight =
        "10px solid rgba(44, 102, 110, 0.3)";
    }
  }, [location]);

  return (
    <div
      className={styles.sidebar}
      id="sidebar"
      style={
        props.isShowing
          ? { transform: "translateX(0)" }
          : {
              transform: "translateX(250px)",
              background:
                "linear-gradient(336deg, rgba(251, 196, 63, 1) 0%, rgba(135, 216, 241, 1) 100%)",
            }
      }
    >
      <div className={styles.logoArea}>
        <div className={styles.imgWrapper}>
          <img src={logo} />
        </div>
      </div>
      <nav>
        <ul>
          <li className={styles.sidebarList}>
            <Link to="/admin" className={styles.tag} ref={linkBoard}>
              社區公告
            </Link>
          </li>
          <li className={styles.sidebarList}>
            <Link
              to="/admin/resident"
              className={styles.tag}
              ref={linkResident}
            >
              住戶資訊
            </Link>
          </li>
          <li className={styles.sidebarList}>
            <Link to="/admin/mailbox" className={styles.tag} ref={linkMailbox}>
              信件包裹紀錄
            </Link>
          </li>
          <li className={styles.sidebarList}>
            <Link to="/admin/field" className={styles.tag} ref={linkField}>
              場地租借紀錄
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.footer}>
        <div className={styles.copyright}>&copy; 2020 Apartment Assistant</div>
        <button id="logout" className={styles.logout} onClick={props.logout}>
          <img src={logout} />
        </button>
      </div>
    </div>
  );
}
