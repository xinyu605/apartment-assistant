import React, { useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import { getTimeStamp } from "./../../firebase";
import styles from "./UpdateBoardList.module.scss";
import clipBoard from "./../../img/clipboard.svg";

export default function UpdateBoardList() {
  const [matterDate, setMatterDate] = useState(0);
  function updateDate(year, month, date) {
    // console.log(year, month, date);
    const seconds = getTimeStamp(year, month, date);
    // console.log(seconds);
    setMatterDate(seconds);
  }
  return (
    <div className={styles.updateBoard}>
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={clipBoard} />
        </div>
        <h2 className={styles.title}>新增公告</h2>
      </div>
      <form className={styles.updateForm}>
        <label className={`${styles.formTitle} ${styles.updateTopic}`}>
          標題
        </label>
        <input className={styles.inputTopic} type="text"></input>
        <label className={`${styles.formTitle} ${styles.updateDeadline}`}>
          公告期限
        </label>
        <SmallCalendar updateDate={updateDate} />

        <label className={`${styles.formTitle}  ${styles.updateContent}`}>
          公告內容
        </label>
        <textarea
          className={styles.inputContent}
          id="matterContent"
          rows="8"
        ></textarea>
        <button className={styles.submitMatter}>確認送出</button>
      </form>
    </div>
  );
}
