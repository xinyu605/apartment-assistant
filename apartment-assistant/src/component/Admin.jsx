import React from "react";
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

export function Admin(props) {
  return (
    <Router>
      <Route path="/admin">
        <Sidebar logout={props.logout} />

        <Switch>
          <Route path="/admin/resident">
            <Resident />
          </Route>
          <Route path="/admin/mailbox">
            <Mailbox />
          </Route>
          <Route path="/admin/field">
            <Field />
          </Route>
          <Route path="/admin">
            <Board />
          </Route>
        </Switch>
      </Route>
    </Router>
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
