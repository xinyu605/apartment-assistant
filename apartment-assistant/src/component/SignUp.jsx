import React, { useEffect, useState } from "react";
import { nativeSignIn, nativeSignUp } from "./../firebase";
import { checkEmailFormat, checkPasswordLength } from "./../lib";

export default function SignUp(props) {
  const [emailSignUp, setEmailSignUp] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [emailSignIn, setEmailSignIn] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  console.log(props);

  function getUserInput(e) {
    switch (e.currentTarget.id) {
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
    if (checkEmailFormat(emailSignUp) && checkPasswordLength(passwordSignUp)) {
      nativeSignUp(emailSignUp, passwordSignUp);
    } else {
      console.log("Sign up failed");
    }
  }

  function submitSignInData(e) {
    e.preventDefault();
    if (emailSignIn.length === 0 || passwordSignIn.length < 6) {
      alert("資料尚未填寫完成喔！");
    } else {
      nativeSignIn(emailSignIn, passwordSignIn);
    }
  }

  return (
    <div>
      <div className="signUp">
        <h2>註冊新帳號</h2>
        <form>
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
        </form>
      </div>
    </div>
  );
}
