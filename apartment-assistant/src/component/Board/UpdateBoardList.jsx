import React, { useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import { getTimeStamp, uploadAnnouncement } from "./../../firebase";
import styles from "./UpdateBoardList.module.scss";
import clipBoard from "./../../img/clipboard.svg";

export default function UpdateBoardList() {
  const [deadline, setDeadline] = useState(0);

  function prepareToAnnounce(e) {
    e.preventDefault();
    const author = document.querySelector("#matterAuthor").value;
    const topic = document.querySelector("#matterTopic").value;
    const content = document.querySelector("#matterContent").value;
    const updateForm = document.querySelector("#updateForm");
    const inputs = updateForm.querySelectorAll("input");
    const textarea = updateForm.querySelector("#matterContent");
    let dd = new Date();
    let updateTime = getTimeStamp(
      dd.getFullYear(),
      dd.getMonth() + 1,
      dd.getDate()
    );

    let data;
    let message = false;

    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        message = true;
      }
    }

    if (textarea.value === "") {
      message = true;
    }

    if (message) {
      alert("請確實填寫資料");
      message = false;
    } else {
      data = {
        topic: topic,
        author: author,
        updateTime: updateTime,
        deadline: deadline,
        content: content,
      };
      // console.log(data);
      uploadAnnouncement(data);
      alert("公告已成功上傳！");
      inputs.forEach((input) => {
        input.value = "";
      });
      textarea.value = "";
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
      <form id="updateForm" className={styles.updateForm}>
        <label className={`${styles.formTitle}  ${styles.updateAuthor}`}>
          發布者
        </label>
        <input
          id="matterAuthor"
          className={styles.inputAuthor}
          type="text"
          placeholder="請填寫姓名"
        ></input>
        <label className={`${styles.formTitle} ${styles.updateTopic}`}>
          公告標題
        </label>
        <input
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
          className={styles.inputContent}
          id="matterContent"
          rows="8"
          placeholder="請填寫公告內容"
        ></textarea>
        <button className={styles.submitMatter} onClick={prepareToAnnounce}>
          確認送出
        </button>
      </form>
    </div>
  );
}
