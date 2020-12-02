import React, { useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { nativeSignIn, nativeSignUp, signInWithGoogle } from "../firebase";
import { checkEmailFormat, checkPasswordLength, checkUserName } from "../lib";
import styles from "./SignIn.module.scss";

export default function SignIn() {
  const [userName, setUserName] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  let history = useHistory();

  function getUserInput(e) {
    switch (e.currentTarget.id) {
      case "userName":
        setUserName(e.currentTarget.value);
        break;
      case "emailSignUp":
        setEmailSignUp(e.currentTarget.value);
        break;
      case "emailSignIn":
        setEmailSignIn(e.currentTarget.value);
        break;
      case "pwdSignUp":
        setPasswordSignUp(e.currentTarget.value);
        break;
      case "pwdSignIn":
        setPasswordSignIn(e.currentTarget.value);
        break;
      default:
        break;
    }
  }

  function submitSignUpData(e) {
    e.preventDefault();
    if (
      checkEmailFormat(emailSignUp) &&
      checkPasswordLength(passwordSignUp) &&
      checkUserName(userName)
    ) {
      nativeSignUp(emailSignUp, passwordSignUp, userName);
    } else {
      console.log("Sign up failed");
    }
  }

  function submitSignInData(e) {
    e.preventDefault();
    if (emailSignIn.length === 0 || passwordSignIn.length < 6) {
      alert("資料尚未填寫完成喔！");
    } else {
      nativeSignIn(emailSignIn, passwordSignIn)
        .then((result) => {
          if (result === "admin") {
            history.push("/mailbox");
          } else {
            history.push("/entry"); //之後改成 /entry (住戶入口頁)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  function googleSignIn(e) {
    e.preventDefault();
    signInWithGoogle().then((result) => {
      console.log(result);
      if (result === "admin") {
        history.push("/mailbox");
      } else {
        history.push("/entry"); //之後改成 /entry (住戶入口頁)
      }
    });
  }

  return (
    <div>
      <div className="signUp">
        <h2>註冊新帳號</h2>
        <form>
          <label>請輸入姓名</label>
          <input
            id="userName"
            type="text"
            placeholder="請輸入姓名"
            onChange={getUserInput}
          ></input>
          <label>請輸入Email</label>
          <input
            id="emailSignUp"
            type="text"
            placeholder="example@gmail.com"
            onChange={getUserInput}
          ></input>
          <label>請輸入密碼</label>
          <input
            id="pwdSignUp"
            type="password"
            placeholder="******"
            onChange={getUserInput}
          ></input>
          <button id="submitSignUp" onClick={submitSignUpData}>
            註冊
          </button>
        </form>
      </div>
      <div className="signIn">
        <h2>會員登入</h2>
        <form>
          <label>請輸入Email</label>
          <input
            id="emailSignIn"
            type="text"
            placeholder="example@gmail.com"
            onChange={getUserInput}
          ></input>
          <label>請輸入密碼</label>
          <input
            id="pwdSignIn"
            type="password"
            placeholder="******"
            onChange={getUserInput}
          ></input>
          <button id="submitSignIn" onClick={submitSignInData}>
            登入
          </button>
          <button onClick={googleSignIn}>Google登入</button>
        </form>
      </div>
    </div>
  );
}
