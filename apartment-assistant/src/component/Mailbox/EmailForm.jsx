import React, { useEffect, useState, useRef } from "react";
import { sendMail } from "./../../firebase";
import styles from "./EmailForm.module.scss";
import close from "./../../img/close.svg";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import { checkEmailFormat } from "../../lib";
import AlertDownward from "../Common/AlertDownward";

export function EmailForm(props) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  //alert dialog
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //ref
  const recipientEmailInput = useRef(null);
  const subjectInput = useRef(null);
  const contentTextarea = useRef(null);

  /******************************************* 
    Put default values into email form inputs
  ********************************************/
  useEffect(() => {
    // console.log(props.receiver, props.receiverEmail);
    const emailDefault = document.querySelector("#recipientEmail");
    const subjectDefault = document.querySelector("#subject");
    const contentDefault = document.querySelector("#content");
    if (emailDefault) {
      if (props.receiverEmail) {
        emailDefault.value = props.receiverEmail;
      } else {
        emailDefault.value = "";
      }

      setRecipientEmail(emailDefault.value);
    }
    if (subjectDefault) {
      subjectDefault.value = "您有一則新的信件/包裹通知";
      setSubject(subjectDefault.value);
    }
    if (contentDefault) {
      contentDefault.value = `${props.receiver}先生/小姐您好，您有一份${props.mailType}今日寄達，請撥空至${props.place}領取，謝謝！`;
      setContent(contentDefault.value);
    }
  }, [props]);

  /***************************** 
    Get Email form input values
  ******************************/
  function updateEmailInfo(e) {
    const target = e.currentTarget;
    switch (target.id) {
      case "recipientEmail":
        setRecipientEmail(target.value);
        break;
      case "subject":
        setSubject(target.value);
        break;
      case "content":
        setContent(target.value);
        break;
      default:
        break;
    }
  }

  /*************************************************** 
    Pass data to firebase cloud function to send email
   ***************************************************/
  function prepareToSendEmail(e) {
    e.preventDefault();
    const data = {
      name: props.receiver,
      email: recipientEmail,
      subject: subject,
      content: content,
    };
    // console.log(data);
    const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";
    const checkEmailResult = checkEmailFormat(data.email);

    if (
      checkEmailResult === "Email格式錯誤" ||
      checkEmailResult === "Email欄位不可留空"
    ) {
      recipientEmailInput.current.style.boxShadow = focusBoxShadow;
      setAlertDownward(true);
      setAlertDownwardMessage(checkEmailResult);
    } else if (subjectInput.current.value === "") {
      subjectInput.current.style.boxShadow = focusBoxShadow;
      setAlertDownward(true);
      setAlertDownwardMessage("信件主旨不可留空");
    } else if (contentTextarea.current.value === "") {
      contentTextarea.current.style.boxShadow = focusBoxShadow;
      setAlertDownward(true);
      setAlertDownwardMessage("信件內容不可留空");
    } else {
      sendMail(data); //call firebase cloud function
      setSuccessAlert(true);
      setSuccessMessage("信件成功寄出");
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      window.setTimeout(() => {
        props.closeForm();
      }, 2001);

      //back to default
      recipientEmailInput.current.style.boxShadow = "none";
      subjectInput.current.style.boxShadow = "none";
      contentTextarea.current.style.boxShadow = "none";
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    setAlertDownward(false);
  }

  if (props.isEditingMail) {
    return (
      <div className={styles.emailBackground}>
        <div className={styles.emailFrom}>
          <div className={styles.informTitle}>
            <h2>通知信件即將寄出，請確認！</h2>
            <button className={styles.closeBtn} onClick={props.toggleEmailForm}>
              <img src={close} />
            </button>
          </div>

          <form className={styles.fillPlace}>
            <p
              className={`${styles.emailInputTitle} ${styles.emailInputTitle1}`}
            >
              收件者
            </p>
            <input
              ref={recipientEmailInput}
              id="recipientEmail"
              className={`${styles.emailInput} ${styles.emailInput1}`}
              type="text"
              placeholder="請輸入email"
              onChange={updateEmailInfo}
            ></input>

            <p
              className={`${styles.emailInputTitle} ${styles.emailInputTitle2}`}
            >
              主旨
            </p>
            <input
              ref={subjectInput}
              id="subject"
              className={`${styles.emailInput} ${styles.emailInput2}`}
              type="text"
              placeholder="請輸入主旨"
              onChange={updateEmailInfo}
            ></input>

            <p
              className={`${styles.emailInputTitle} ${styles.emailInputTitle3}`}
            >
              內容
            </p>
            <textarea
              ref={contentTextarea}
              id="content"
              className={`${styles.emailInput} ${styles.emailInput3}`}
              rows="8"
              onChange={updateEmailInfo}
            ></textarea>

            <button className={styles.sendBtn} onClick={prepareToSendEmail}>
              送出
            </button>
          </form>
        </div>
        <AlertDownward
          showAlertDownward={showAlertDownward}
          alertDownwardMessage={alertDownwardMessage}
          closeAlert={closeAlert}
        />
        <AlertSuccessMsg
          showSuccessAlert={showSuccessAlert}
          successMessage={successMessage}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}
