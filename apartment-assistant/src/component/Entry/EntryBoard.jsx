import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { getBoardList } from "./../../firebase";
import { showDate } from "./../../utils/lib";
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

  return (
    <div className={styles.issues} id="issues">
      <div className={styles.title}>
        <div className={styles.imgWrapper}>
          <img src={issuesIcon} />
        </div>
        <h2>社區公告</h2>
      </div>

      <ul className={styles.issueList}>
        {issues.map((issue) => {
          return <Issue issue={issue} key={`issue${issue.issueId}`} />;
        })}
      </ul>
    </div>
  );
}

function Issue(props) {
  const [isShowing, setShowing] = useState(false);
  const updateTime = showDate(props.issue.updateTime.seconds);
  const deadline = showDate(props.issue.deadline.seconds);

  function toggleDetail(e) {
    e.preventDefault();
    isShowing ? setShowing(false) : setShowing(true);
  }

  return (
    <li className={styles.issue} key={nanoid()}>
      <p className={styles.updateTime}>{updateTime}</p>
      <h3 className={styles.issueTopic}>{props.issue.topic}</h3>
      <button className={styles.readMoreBtn} onClick={toggleDetail}>
        {isShowing ? "關閉" : "閱讀"}
      </button>
      <div
        className={styles.issueDetail}
        style={isShowing ? { display: "grid" } : { display: "none" }}
      >
        <p className={styles.author}>發布者：{props.issue.author}</p>
        <p className={styles.deadline}>公告期限：{deadline}</p>
        <p className={styles.content}>{props.issue.content}</p>
      </div>
    </li>
  );
}
