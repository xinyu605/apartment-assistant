import React from "react";
import "./App.css";

import { getMailList, getReceiverInfo } from "./firebase";

const untakenMailData = getMailList(false); // get untaken mail list
console.log(untakenMailData);
// getReceiverInfo("201", "xHdjdEEbxkMU9ZI801CW"); //put family members into receiver's information (update mailbox document)

function App() {
  return <div className="App"></div>;
}

export default App;
