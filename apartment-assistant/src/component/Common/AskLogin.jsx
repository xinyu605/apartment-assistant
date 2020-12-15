import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from "react-router-dom";
import styles from "./AskLogin.module.scss";
import logo from "./../../img/logo.png";

export default function AskLogin(props) {
  let history = useHistory();

  if (props.isLogin === true) {
    return <div></div>;
  } else if (props.isLogin === false) {
    window.setTimeout(() => {
      history.push("/signin");
    }, 5000);

    return (
      <div className={styles.askLogin}>
        <div className={styles.dialog}>
          <div className={styles.logoWrapper}>
            <img src={logo} className={styles.logoImg} />
          </div>
          <h2 className={styles.topic}>請先登入</h2>
          <p className={styles.subTopic}>即將前往登入頁</p>
          <div className={styles.circles}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
