import React, { useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { nativeSignIn, nativeSignUp, signInWithGoogle } from "../firebase";
import { checkEmailFormat, checkPasswordLength, checkUserName } from "../lib";
import styles from "./SignIn.module.scss";
import logo from "./../img/logo.png";
import vintage from "./../img/vintage-1149558_1920.jpg";

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
            history.push("/admin");
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
        history.push("/admin");
      } else {
        history.push("/entry"); //之後改成 /entry (住戶入口頁)
      }
    });
  }

  function callSignUp() {
    const imageCard = document.querySelector("#imageCard");
    console.log(imageCard);
    imageCard.style.transform = "translateX(450px)";
    imageCard.style.transition = "all 0.5s ease";
  }

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div id="imageCard" className={styles.image}>
          <img src={vintage} className={styles.coverImg}></img>
          <div className={styles.imgWrapper}>
            <img src={logo} className={styles.logoImg} />
          </div>
        </div>
        <div className={styles.signUp}>
          <h2>註冊新帳號</h2>
          <form>
            <div className={styles.inputWrapper}>
              <input
                id="userName"
                type="text"
                placeholder="請輸入姓名"
                onChange={getUserInput}
              ></input>
              <div className={styles.signInName}></div>
            </div>

            <div className={styles.inputWrapper}>
              <input
                id="emailSignUp"
                type="text"
                placeholder="example@gmail.com"
                onChange={getUserInput}
              ></input>
              <div className={styles.loginImg}></div>
            </div>

            <div className={styles.inputWrapper}>
              <input
                id="pwdSignUp"
                type="password"
                placeholder="******"
                onChange={getUserInput}
              ></input>
              <div className={styles.lockImg}></div>
            </div>

            <button id="submitSignUp" onClick={submitSignUpData}>
              註冊
            </button>
          </form>
        </div>
        <div className={styles.signIn}>
          <h2>會員登入</h2>
          <form>
            <div className={styles.inputWrapper}>
              <input
                id="emailSignIn"
                type="text"
                placeholder="Email"
                onChange={getUserInput}
              ></input>
              <div className={styles.loginImg}></div>
            </div>
            <div className={styles.inputWrapper}>
              <input
                id="pwdSignIn"
                type="password"
                placeholder="密碼"
                onChange={getUserInput}
              ></input>
              <div className={styles.lockImg}></div>
            </div>

            <button id="submitSignIn" onClick={submitSignInData}>
              登入
            </button>
            <button onClick={googleSignIn}>Google登入</button>
          </form>
          <div
            id="clickToSignUp"
            className={styles.clickToSignUp}
            onClick={callSignUp}
          >
            立即註冊
          </div>
        </div>
      </div>
    </div>
  );
}
