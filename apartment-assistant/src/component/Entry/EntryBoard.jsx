import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { getBoardList } from "./../../firebase";
import { showDate } from "./../../lib";
import styles from "./EntryBoard.module.scss";
import issuesIcon from "./../../img/promotion.svg";

export default function EntryBoard() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    getBoardList(getIssues);
    function getIssues(boardList) {
      setIssues(boardList);
    }
  }, []);

  const IssueList = issues.map((issue) => {
    const updateTime = showDate(issue.updateTime.seconds);
    const deadline = showDate(issue.deadline.seconds);
    const index = issues.indexOf(issue);

    function toggleDetail(e) {
      const detail = document.querySelector(`#detail${index}`);
      console.log(e.currentTarget.value);
      if (detail.style.display === "none") {
        detail.style.display = "grid";
        e.currentTarget.textContent = "關閉";
        e.currentTarget.style.backgroundColor = "#618985";
      } else {
        detail.style.display = "none";
        e.currentTarget.textContent = "閱讀";
        e.currentTarget.style.backgroundColor = "#96bbbb";
      }
    }

    return (
      <li className={styles.issue} key={nanoid()}>
        <p className={styles.updateTime}>{updateTime}</p>
        <h3 className={styles.issueTopic}>{issue.topic}</h3>
        <button
          id={`readBtn${index}`}
          className={styles.readMoreBtn}
          onClick={toggleDetail}
        >
          閱讀
        </button>
        <div
          id={`detail${index}`}
          className={styles.issueDetail}
          style={{ display: "none" }}
        >
          <p className={styles.author}>發布者：{issue.author}</p>
          <p className={styles.deadline}>公告期限：{deadline}</p>
          <p className={styles.content}>{issue.content}</p>
        </div>
      </li>
    );
  });

  return (
    <div className={styles.issues} id="issues">
      <div className={styles.title}>
        <div className={styles.imgWrapper}>
          <img src={issuesIcon} />
        </div>
        <h2>社區公告</h2>
      </div>

      <ul className={styles.issueList}>{IssueList}</ul>
    </div>
  );
}
