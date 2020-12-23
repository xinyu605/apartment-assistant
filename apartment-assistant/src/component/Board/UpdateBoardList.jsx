import React, { useState, useRef } from "react";
import { SmallCalendar } from "./SmallCalendar";
import { getTimeStamp, uploadAnnouncement } from "./../../firebase";
import styles from "./UpdateBoardList.module.scss";
import clipBoard from "./../../img/clipboard.svg";
import Alertbox from "./../Common/Alertbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";

export default function UpdateBoardList() {
  const [deadline, setDeadline] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const author = useRef(null);
  const topic = useRef(null);
  const content = useRef(null);
  const updateForm = useRef(null);

  function prepareToAnnounce(e) {
    e.preventDefault();
    const inputs = updateForm.current.querySelectorAll("input");
    let dd = new Date();
    let updateTime = getTimeStamp(
      dd.getFullYear(),
      dd.getMonth() + 1,
      dd.getDate()
    );

    let data;

    if (
      author.current.value === "" ||
      topic.current.value === "" ||
      content.current.value === ""
    ) {
      setShowAlert(true);
      setAlertMessage("請確實填寫空白欄位");
    } else {
      data = {
        topic: topic.current.value,
        author: author.current.value,
        updateTime: updateTime,
        deadline: deadline,
        content: content.current.value,
      };
      // console.log(data);
      uploadAnnouncement(data);
      setSuccessAlert(true);
      setSuccessMessage("公告已成功上傳");

      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      inputs.forEach((input) => {
        input.value = "";
      });
      content.current.value = "";
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "closeAlertBtn":
        setShowAlert(false);
        break;
      default:
        break;
    }
  }

  /*****************************
  prepare seconds for firebase
  ******************************/
  function updateDate(year, month, date) {
    const seconds = getTimeStamp(year, month, date);
    setDeadline(seconds);
  }
  return (
    <div className={styles.updateBoard}>
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={clipBoard} />
        </div>
        <h2 className={styles.title}>新增公告</h2>
      </div>
      <form ref={updateForm} id="updateForm" className={styles.updateForm}>
        <label className={`${styles.formTitle}  ${styles.updateAuthor}`}>
          發布者
        </label>
        <input
          ref={author}
          id="matterAuthor"
          className={styles.inputAuthor}
          type="text"
          placeholder="請填寫姓名"
        ></input>
        <label className={`${styles.formTitle} ${styles.updateTopic}`}>
          公告標題
        </label>
        <input
          ref={topic}
          id="matterTopic"
          className={styles.inputTopic}
          type="text"
          placeholder="請填寫標題"
        ></input>
        <label className={`${styles.formTitle} ${styles.updateDeadline}`}>
          公告期限
        </label>
        <SmallCalendar updateDate={updateDate} />

        <label className={`${styles.formTitle} ${styles.updateContent}`}>
          公告內容
        </label>
        <textarea
          ref={content}
          className={styles.inputContent}
          id="matterContent"
          rows="8"
          placeholder="請填寫公告內容"
        ></textarea>
        <button className={styles.submitMatter} onClick={prepareToAnnounce}>
          確認送出
        </button>
        <Alertbox
          alertMessage={alertMessage}
          showAlert={showAlert}
          closeAlert={closeAlert}
        />
      </form>
      <AlertSuccessMsg
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
        closeAlert={closeAlert}
      />
    </div>
  );
}
