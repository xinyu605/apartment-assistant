import React, { useState, useEffect } from "react";

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
import { Admin } from "./component/Admin";
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
            <Switch>
              <Route path="/entry">
                <Entry logout={logout} />
              </Route>
              <Route path="/admin">
                <Admin logout={logout} />
              </Route>
              <Route path="/">
                <Home logout={logout} />
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

function Entry(props) {
  return (
    <div>
      <h2>住戶入口頁</h2>
      <button onClick={props.logout}>登出</button>
    </div>
  );
}

function Home(props) {
  return (
    <div>
      <h2>Homepage</h2>
      <button onClick={props.logout}>登出</button>
    </div>
  );
}

export default App;
