import React, { useState, useEffect } from "react";
import logo from "./img/logo.png";
import styles from "./App.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  // useParams,   //nested router
  // useRouteMatch,
} from "react-router-dom";
import Mailbox from "./component/Mailbox";
import SignUp from "./component/SignUp";
import { checkUserSignInOrNot } from "./firebase";

function App() {
  const [uid, setUid] = useState("");
  useEffect(() => {
    setUid(checkUserSignInOrNot());
  }, [uid]);

  return (
    <Router>
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
                <Link to="/">社區公告</Link>
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
      <SignUp checkSignIn={checkUserSignInOrNot} />
    </Router>
  );
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
