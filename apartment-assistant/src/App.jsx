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
import Entry from "./component/Entry";
import SignIn from "./component/SignIn";
import { checkLogin } from "./firebase";
import firebase from "firebase";

let auth = firebase.auth();

function App() {
  const [uid, setUid] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        // console.log(auth.currentUser.uid);
        console.log("fire2");
        setUid(auth.currentUser.uid);
      }
    });
  }, []);

  console.log(uid);
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
                <Admin logout={logout} uid={uid} />
              </Route>
              <Route path="/">
                <Home logout={logout} />
                <div>been here </div>
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

function Home(props) {
  return (
    <div>
      <h2>Homepage</h2>
      <button onClick={props.logout}>登出</button>
    </div>
  );
}

export default App;
