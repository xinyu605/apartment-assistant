import React from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  // useParams,   //nested router (目前用不到)
  // useRouteMatch,
} from "react-router-dom";
import Mailbox from "./component/Mailbox";

import { getResidentList, getMailList, getReceiverInfo } from "./firebase";

// getResidentList();
// getReceiverInfo("201", "xHdjdEEbxkMU9ZI801CW"); //put family members into receiver's information (update mailbox document)
// const untakenMailData = getMailList(false); // get untaken mail list
// console.log(untakenMailData);

function App() {
  return (
    <Router>
      <div>
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
