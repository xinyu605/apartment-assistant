import React, { useState, useRef, useEffect } from "react";
import AlertDownward from "./../Common/AlertDownward";
import styles from "./SignIn.module.scss";
import user from "./../../img/user.svg";
import email from "./../../img/email.svg";
import lock from "./../../img/lock.svg";
import {
  checkUserName,
  checkEmailFormat,
  checkPasswordLength,
} from "../../lib";
import { nativeSignUp } from "./../../firebase";
import AlertSuccessMsg from "../Common/AlertSuccessMsg";

export default function SignUp(props) {
  const [userName, setUserName] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");

  // alert dialogs
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const nameSignUpInput = useRef(null);
  const emailSignUpInput = useRef(null);
  const passwordSignUpInput = useRef(null);
  const remindNameSignUp = useRef(null);
  const remindEmailSignUp = useRef(null);
  const remindPasswordSignUp = useRef(null);

  /****************************************
    check signUp inputs format
  *****************************************/
  function checkSignUpInput(e) {
    const target = e.currentTarget;
    const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";
    switch (target.id) {
      case "userName":
        const nameInput = checkUserName(target.value);
        if (nameInput === "姓名欄位不可留空") {
          remindNameSignUp.current.textContent = nameInput;
          remindNameSignUp.current.style.opacity = "1";
          remindNameSignUp.current.style.transition = "all 0.3s ease";
          nameSignUpInput.current.style.boxShadow = focusBoxShadow;
          nameSignUpInput.current.style.transition = "all 0.3s ease";
        } else {
          remindNameSignUp.current.textContent = "";
          nameSignUpInput.current.style.boxShadow = "none";
          setUserName(target.value);
        }

        break;
      case "emailSignUp":
        const emailInput = checkEmailFormat(target.value);
        if (
          emailInput === "Email欄位不可留空" ||
          emailInput === "Email格式錯誤"
        ) {
          remindEmailSignUp.current.textContent = emailInput;
          remindEmailSignUp.current.style.opacity = "1";
          remindEmailSignUp.current.style.transition = "all 0.3s ease";
          emailSignUpInput.current.style.boxShadow = focusBoxShadow;
          emailSignUpInput.current.style.transition = "all 0.3s ease";
        } else {
          remindEmailSignUp.current.textContent = "";
          emailSignUpInput.current.style.boxShadow = "none";
          setEmailSignUp(target.value);
        }
        break;

      case "pwdSignUp":
        const passwordInput = checkPasswordLength(target.value);
        if (passwordInput === "密碼需超過6個字元") {
          remindPasswordSignUp.current.textContent = passwordInput;
          remindPasswordSignUp.current.style.opacity = "1";
          remindPasswordSignUp.current.style.transition = "all 0.3s ease";
          passwordSignUpInput.current.style.boxShadow = focusBoxShadow;
          passwordSignUpInput.current.style.transition = "all 0.3s ease";
        } else {
          remindPasswordSignUp.current.textContent = "";
          passwordSignUpInput.current.style.boxShadow = "none";
          setPasswordSignUp(target.value);
        }
        break;
      default:
        break;
    }
  }

  function submitSignUpData(e) {
    e.preventDefault();
    if (
      checkEmailFormat(emailSignUp) === true &&
      checkPasswordLength(passwordSignUp) === true &&
      checkUserName(userName) === true
    ) {
      nativeSignUp(emailSignUp, passwordSignUp, userName)
        .then((result) => {
          console.log(result);
          if (result === "success") {
            setSuccessAlert(true);
            setSuccessMessage("註冊成功！請重新登入");

            setUserName("");
            setEmailSignUp("");
            setPasswordSignUp("");

            //move image card

            const imageCard = document.querySelector("#imageCard");
            imageCard.style.transform = "translateX(0px)";
            imageCard.style.transition = "all 0.5s ease";
          } else {
            setAlertDownward(true);
            setAlertDownwardMessage(result.message);
            console.log(result.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setAlertDownward(true);
      setAlertDownwardMessage("註冊失敗！請重新註冊");
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "closeAlertBtn":
        setAlertDownward(false);
        break;
      default:
        break;
    }
  }

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
            onChange={checkSignUpInput}
            onBlur={checkSignUpInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={user} />
          </div>
        </div>
        <p
          ref={remindNameSignUp}
          id="remindNameSignUp"
          className={`${styles.remindMessage} ${styles.remindMsgSignUp}`}
        ></p>
        <div className={styles.inputWrapper}>
          <input
            ref={emailSignUpInput}
            id="emailSignUp"
            className={styles.loginInputs}
            type="text"
            placeholder="請輸入Email"
            onChange={checkSignUpInput}
            onBlur={checkSignUpInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={email} />
          </div>
        </div>
        <p
          ref={remindEmailSignUp}
          id="remindEmailSignUp"
          className={`${styles.remindMessage} ${styles.remindMsgSignUp}`}
        ></p>
        <div className={styles.inputWrapper}>
          <input
            ref={passwordSignUpInput}
            id="pwdSignUp"
            className={styles.loginInputs}
            type="password"
            placeholder="請輸入6位以上英數字"
            onChange={checkSignUpInput}
            onBlur={checkSignUpInput}
          ></input>
          <div className={styles.inputImgWrapper}>
            <img className={styles.inputImg} src={lock} />
          </div>
        </div>
        <p
          ref={remindPasswordSignUp}
          id="remindPasswordSignUp"
          className={`${styles.remindMessage} ${styles.remindMsgSignUp}`}
        ></p>
        <button
          id="submitSignUp"
          className={styles.buttonSignUp}
          onClick={submitSignUpData}
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
      <AlertSuccessMsg
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
      />
      <AlertDownward
        showAlertDownward={showAlertDownward}
        alertDownwardMessage={alertDownwardMessage}
        closeAlert={closeAlert}
      />
    </div>
  );
}
