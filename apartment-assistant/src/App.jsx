import React, { useState, useEffect } from "react";
import logo from "./img/logo.png";
import styles from "./App.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  // useParams,   //nested router
  // useRouteMatch,
} from "react-router-dom";
import Mailbox from "./component/Mailbox";
import SignIn from "./component/SignIn";
import firebase from "firebase";

let auth = firebase.auth();

function App() {
  const [uid, setUid] = useState("");
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // console.log(auth.currentUser.uid);
      setUid(auth.currentUser.uid);
    }
  });

  function logout() {
    auth.signOut().then(() => {
      alert("See you later!");
      let user = auth.currentUser;
      console.log(user);
      window.location.href = "/";
    });
  }

  if (uid) {
    return (
      <Router>
        <Route path="/">
          <div className={styles.App}>
            <div className={styles.sidebar}>
              <div className={styles.logoArea}>
                <div className={styles.imgWrapper}>
                  <img src={logo} />
                </div>
              </div>
              <nav>
                <ul>
                  <li>
                    <Link to="/board">社區公告</Link>
                  </li>
                  <li>
                    <Link to="/resident">住戶資訊</Link>
                  </li>
                  <li>
                    <Link to="/mailbox">信件包裹紀錄</Link>
                  </li>
                  <li>
                    <Link to="/field">場地租借紀錄</Link>
                  </li>
                </ul>
              </nav>
              <button id="logout" onClick={logout}>
                登出
              </button>
            </div>

            {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/resident">
                <Resident />
              </Route>
              <Route path="/mailbox">
                <Mailbox />
              </Route>
              <Route path="/field">
                <Field />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Route>
      </Router>
    );
  } else {
    return (
      <Router>
        <Redirect to="/signin" />
        <Route exact path="/signin">
          <SignIn />
        </Route>
      </Router>
    );
  }
}

function Home() {
  return (
    <div>
      <h2>社區公告</h2>
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

export default App;
