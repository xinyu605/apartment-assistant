import React, { useState, useRef, useEffect } from "react";
import styles from "./SignIn.module.scss";
import user from "./../../img/user.svg";
import email from "./../../img/email.svg";
import lock from "./../../img/lock.svg";
import {
  checkUserName,
  checkEmailFormat,
  checkPasswordLength,
} from "../../lib";

export default function SignUp(props) {
  const nameSignUpInput = useRef(null);
  const emailSignUpInput = useRef(null);
  const passwordSignUpInput = useRef(null);
  const remindNameSignUp = useRef(null);
  const remindEmailSignUp = useRef(null);
  const remindPasswordSignUp = useRef(null);

  useEffect(() => {
    const nameInput = checkUserName(props.userName);
    const emailInput = checkEmailFormat(props.emailSignUp);
    const passwordInput = checkPasswordLength(props.passwordSignUp);

    if (nameInput === "姓名欄位不可留空") {
      remindNameSignUp.current.textContent = nameInput;
      remindNameSignUp.current.style.opacity = "1";
      remindNameSignUp.current.style.transition = "all 0.3s ease";
      nameSignUpInput.current.style.border = "1px solid #f26157";
      nameSignUpInput.current.style.transition = "all 0.3s ease";
    } else {
      remindNameSignUp.current.textContent = "";
      nameSignUpInput.current.style.border = "none";
    }

    if (emailInput === "Email欄位不可留空" || emailInput === "Email格式錯誤") {
      remindEmailSignUp.current.textContent = emailInput;
      remindEmailSignUp.current.style.opacity = "1";
      remindEmailSignUp.current.style.transition = "all 0.3s ease";
      emailSignUpInput.current.style.border = "1px solid #f26157";
      emailSignUpInput.current.style.transition = "all 0.3s ease";
    } else {
      remindEmailSignUp.current.textContent = "";
      emailSignUpInput.current.style.border = "none";
    }

    if (passwordInput === "密碼需超過6個字元") {
      remindPasswordSignUp.current.textContent = passwordInput;
      remindPasswordSignUp.current.style.opacity = "1";
      remindPasswordSignUp.current.style.transition = "all 0.3s ease";
      passwordSignUpInput.current.style.border = "1px solid #f26157";
      passwordSignUpInput.current.style.transition = "all 0.3s ease";
    } else {
      remindPasswordSignUp.current.textContent = "";
      passwordSignUpInput.current.style.border = "none";
    }
  }, [props.userName, props.emailSignUp, props.passwordSignUp]);

  return (
    <div id="signUpCard" className={styles.signUp}>
      <h2>註冊新帳號</h2>
      <form className={styles.signUpPageForm}>
        <div className={styles.inputWrapper}>
          <input
            ref={nameSignUpInput}
            id="userName"
            className={styles.loginInputs}
            type="text"
            placeholder="請輸入姓名"
            onChange={props.getUserInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={user} />
          </div>
        </div>
        <p
          ref={remindNameSignUp}
          id="remindNameSignUp"
          className={styles.remindMessage}
        ></p>
        <div className={styles.inputWrapper}>
          <input
            ref={emailSignUpInput}
            id="emailSignUp"
            className={styles.loginInputs}
            type="text"
            placeholder="請輸入Email"
            onChange={props.getUserInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={email} />
          </div>
        </div>
        <p
          ref={remindEmailSignUp}
          id="remindEmailSignUp"
          className={styles.remindMessage}
        ></p>
        <div className={styles.inputWrapper}>
          <input
            ref={passwordSignUpInput}
            id="pwdSignUp"
            className={styles.loginInputs}
            type="password"
            placeholder="請輸入6位以上英數字"
            onChange={props.getUserInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={lock} />
          </div>
        </div>
        <p
          ref={remindPasswordSignUp}
          id="remindPasswordSignUp"
          className={styles.remindMessage}
        ></p>
        <button
          id="submitSignUp"
          className={styles.buttonSignUp}
          onClick={props.submitSignUpData}
        >
          註冊
        </button>
        <div
          id="clickToSignIn"
          className={styles.clickToSignUp}
          onClick={props.moveCard}
        >
          登入
        </div>
        <div
          id="clickToSignInMobile"
          className={styles.clickToSignUpMobile}
          onClick={props.exchangeCards}
        >
          登入
        </div>
      </form>
    </div>
  );
}
