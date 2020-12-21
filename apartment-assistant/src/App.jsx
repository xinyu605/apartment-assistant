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
import AlertDownward from "./component/Common/AlertDownward";
import firebase from "firebase";

let auth = firebase.auth();

function App() {
  const [showAlertDownward, setShowAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");

  function logout() {
    setShowAlertDownward(true);
    setAlertDownwardMessage("See You Later!");

    // auth.signOut().then(() => {
    //   alert("See you later!");
    //   let user = auth.currentUser;
    //   console.log(user);
    //   window.location.href = "/signin";
    // });
  }

  function closeAlert(e) {
    e.preventDefault();
    auth.signOut().then(() => {
      // alert("See you later!");
      let user = auth.currentUser;
      console.log(user);
      window.location.href = "/signin";
    });
    setShowAlertDownward(false);
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
          <AlertDownward
            showAlertDownward={showAlertDownward}
            alertDownwardMessage={alertDownwardMessage}
            closeAlert={closeAlert}
          />
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
