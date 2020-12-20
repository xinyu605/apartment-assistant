import React, { useState, useEffect } from "react";

import styles from "./App.module.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  // useParams,   //nested router
  // useRouteMatch,
} from "react-router-dom";
import { Admin } from "./component/Admin";
import Entry from "./component/Entry/Entry";
import SignIn from "./component/SignIn/SignIn";
import firebase from "firebase";

let auth = firebase.auth();

function App() {
  function logout() {
    auth.signOut().then(() => {
      alert("See you later!");
      let user = auth.currentUser;
      console.log(user);
      window.location.href = "/signin";
    });
  }

  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/">
        <div className={styles.App}>
          <Switch>
            <Route
              path="/entry"
              render={(props) => <Entry {...props} logout={logout} />}
            />
            <Route
              path="/admin"
              render={(props) => <Admin {...props} logout={logout} />}
            />
            <Route path="/signin" component={SignIn} />
          </Switch>
        </div>
      </Route>
    </Router>
  );
}

function Home(props) {
  let history = useHistory();
  let path = "";
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        if (user.email === "admin@apartment.com") {
          path = "/admin";
        } else {
          path = "/entry";
        }
      } else {
        path = "/signin";
      }
      history.push(path);
    });
  }, []);
  return <div className={styles.App}></div>;
}

export default App;
