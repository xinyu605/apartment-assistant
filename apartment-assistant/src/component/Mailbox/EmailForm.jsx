import React, { useEffect, useState } from "react";
import { sendMail } from "./../../firebase";
import styles from "./EmailForm.module.scss";

export function EmailForm(props) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

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
    console.log(data);
    // sendMail(data); //call firebase cloud function
  }

  if (props.isEditingMail) {
    return (
      <div className={styles.emailBackground}>
        <div className={styles.emailFrom}>
          <div className={styles.informTitle}>
            <h2>通知信件即將寄出，請確認！</h2>
            <button className={styles.closeBtn} onClick={props.toggleEmailForm}>
              X
            </button>
          </div>

          <form className={styles.fillPlace}>
            <p
              className={`${styles.emailInputTitle} ${styles.emailInputTitle1}`}
            >
              收件者
            </p>
            <input
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
      </div>
    );
  } else {
    return <div></div>;
  }
}
