import React, { useState } from "react";
import firebase from "firebase";

let auth = firebase.auth();

export default function Entry(props) {
  console.log(auth.currentUser.email);

  return (
    <div>
      <h2>Welcome to Apartment Assistant!</h2>
      <div className="issues">
        <h3>社區公告</h3>
      </div>
      <div className="mails">
        <h3>信件包裹領取通知</h3>
        <h3>目前您有?個信件/包裹尚未領取</h3>
        <div>
          list
          <button>已領取</button>
        </div>
      </div>
      <button onClick={props.logout}>登出</button>
    </div>
  );
}
