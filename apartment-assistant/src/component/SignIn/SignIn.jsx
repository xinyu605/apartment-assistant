import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import SignUp from "./SignUp";
import { nativeSignIn, signInWithGoogle } from "./../../firebase";
import { checkEmailFormat, checkPasswordLength } from "./../../lib";
import styles from "./SignIn.module.scss";
import logo from "./../../img/logo_apartment.png";
import email from "./../../img/email.svg";
import lock from "./../../img/lock.svg";
import vintage from "./../../img/vintage.png";

export default function SignIn() {
  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  let history = useHistory();

  /***************************************** 
    useRef instead of document.querySelector
  ******************************************/
  const emailSignInInput = useRef(null); //#emailSignIn
  const passwordSignInInput = useRef(null); //#pwdSignIn
  const remindEmailSignIn = useRef(null); //#remindEmailSignIn
  const remindPasswordSignIn = useRef(null); //#remindPasswordSignIn

  /*****************************
    check signIn inputs format
  *****************************/

  function checkSignInInput(e) {
    const target = e.currentTarget;
    switch (target.id) {
      case "emailSignIn":
        const emailInput = checkEmailFormat(target.value);
        if (
          emailInput === "Email欄位不可留空" ||
          emailInput === "Email格式錯誤"
        ) {
          remindEmailSignIn.current.textContent = emailInput;
          remindEmailSignIn.current.style.color = "#f26157";
          emailSignInInput.current.style.border = "1px solid #f26157";
          emailSignInInput.current.style.transition = "all 0.3s ease";
        } else {
          remindEmailSignIn.current.textContent = "";
          emailSignInInput.current.style.border = "none";
          setEmailSignIn(target.value);
        }
        break;

      case "pwdSignIn":
        const passwordInput = checkPasswordLength(target.value);
        if (passwordInput === "密碼需超過6個字元") {
          remindPasswordSignIn.current.textContent = passwordInput;
          remindPasswordSignIn.current.style.color = "#f26157";
          passwordSignInInput.current.style.border = "1px solid #f26157";
          passwordSignInInput.current.style.transition = "all 0.3s ease";
        } else {
          remindPasswordSignIn.current.textContent = "";
          passwordSignInInput.current.style.border = "none";
          setPasswordSignIn(target.value);
        }

      default:
        break;
    }
  }

  function submitSignInData(e) {
    e.preventDefault();

    const emailInput = checkEmailFormat(emailSignIn);
    const passwordInput = checkPasswordLength(passwordSignIn);

    if (emailInput === true && passwordInput === true) {
      nativeSignIn(emailSignIn, passwordSignIn)
        .then((result) => {
          if (result === "admin") {
            history.push("/admin");
          } else {
            history.push("/entry");
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
        history.push("/entry");
      }
    });
  }

  function moveCard(e) {
    const imageCard = document.querySelector("#imageCard");
    console.log(imageCard);
    if (e.currentTarget.id === "clickToSignUp") {
      imageCard.style.transform = "translateX(360px)";
      imageCard.style.transition = "all 0.5s ease";
    } else {
      imageCard.style.transform = "translateX(0px)";
      imageCard.style.transition = "all 0.5s ease";
    }
  }

  function exchangeCards(e) {
    const signUpCard = document.querySelector("#signUpCard");
    const signInCard = document.querySelector("#signInCard");
    if (e.currentTarget.id === "clickToSignUpMobile") {
      signUpCard.style.transform = "translateY(-410px)";
      signUpCard.style.opacity = "1";
      signUpCard.style.transition = "all 0.5s ease";
      signInCard.style.transform = "translateY(410px)";
      signInCard.style.opacity = "0";
      signInCard.style.transition = "all 0.5s ease";
    } else {
      signInCard.style.transform = "translateY(0px)";
      signInCard.style.opacity = "1";
      signInCard.style.transition = "all 0.5s ease";
      signUpCard.style.transform = "translateY(0px)";
      signUpCard.style.opacity = "0";
      signUpCard.style.transition = "all 0.5s ease";
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.logoArea}>
        <div className={styles.imgWrapper}>
          <img src={logo} />
        </div>
      </div>
      <div className={styles.container}>
        <div id="imageCard" className={styles.image}>
          <img src={vintage} className={styles.coverImg} />
          <div className={styles.imgWrapper}>
            <img src={logo} className={styles.logoImg} />
          </div>
          <div className={styles.slogan}>
            <div className={styles.sloganTitle}>
              <h2>AT</h2>
              <p>with you</p>
              <p>ANY TIME!</p>
            </div>
            <p className={styles.sloganContent}>─ 最貼近生活的社區管理平台</p>
            <p className={styles.sloganContent}>─ 管理社區大小事的最佳夥伴</p>
          </div>
        </div>

        <div id="signInCard" className={styles.signIn}>
          <h2>會員登入</h2>
          <form id="signInPageForm" className={styles.signInPageForm}>
            <div className={styles.inputWrapper}>
              <input
                ref={emailSignInInput}
                id="emailSignIn"
                className={styles.loginInputs}
                type="text"
                placeholder="Email"
                onChange={checkSignInInput}
              ></input>
              <div className={styles.inputImgWrapper}>
                <img className={styles.inputImg} src={email} />
              </div>
            </div>
            <p
              ref={remindEmailSignIn}
              id="remindEmailSignIn"
              className={styles.remindMessage}
            >
              管理員Email：admin@apartment.com
            </p>
            <div className={styles.inputWrapper}>
              <input
                ref={passwordSignInInput}
                id="pwdSignIn"
                className={styles.loginInputs}
                type="password"
                placeholder="密碼"
                onChange={checkSignInInput}
              ></input>
              <div className={styles.inputImgWrapper}>
                <img className={styles.inputImg} src={lock} />
              </div>
            </div>
            <p
              ref={remindPasswordSignIn}
              id="remindPasswordSignIn"
              className={styles.remindMessage}
            >
              管理員密碼：apartment
            </p>
            <button
              id="submitSignIn"
              className={styles.buttonSignIn}
              onClick={submitSignInData}
            >
              登入
            </button>
            <button className={styles.buttonSignIn} onClick={googleSignIn}>
              Google登入
            </button>
          </form>
          <div
            id="clickToSignUp"
            className={styles.clickToSignUp}
            onClick={moveCard}
          >
            立即註冊
          </div>
          <div
            id="clickToSignUpMobile"
            className={styles.clickToSignUpMobile}
            onClick={exchangeCards}
          >
            立即註冊
          </div>
        </div>

        <SignUp moveCard={moveCard} exchangeCards={exchangeCards} />
      </div>
    </div>
  );
}
