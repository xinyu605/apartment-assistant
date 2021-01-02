import React, { useEffect, useState, useRef } from "react";
import { SmallCalendar } from "./SmallCalendar";
import Alertbox from "./../Common/Alertbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import styles from "./DetailArea.module.scss";
import { showDate } from "./../../utils/lib";
import { transferToFirebaseTimeStamp, updateDocById } from "./../../firebase";
import editIcon from "./../../img/edit555.svg";
import trashIcon from "./../../img/trash555.svg";
import doneIcon from "./../../img/check.svg";
import cancelIcon from "./../../img/close.svg";

export default function DetailArea(props) {
  const details = props.details;
  const [isEditing, setEditing] = useState(false);
  const [author, setAuthor] = useState(details.author);
  const [topic, setTopic] = useState(details.topic);
  const [content, setContent] = useState(details.content);
  const [publishTimeStamp, setPublishTimeStamp] = useState(0);
  const [yearPublish, setYearPublish] = useState(0);
  const [monthPublish, setMonthPublish] = useState(0);
  const [datePublish, setDatePublish] = useState(0);
  const [deadlineTimeStamp, setDeadlineTimeStamp] = useState(0);
  const [yearDeadline, setYearDeadline] = useState(0);
  const [monthDeadline, setMonthDeadline] = useState(0);
  const [dateDeadline, setDateDeadline] = useState(0);

  const topicInput = useRef(null);
  const authorInput = useRef(null);
  const contentInput = useRef(null);

  const [showAlertbox, setAlertbox] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setAuthor(details.author);
    setTopic(details.topic);
    setContent(details.content);

    //publish time
    if (details.updateTime) {
      const publishMilliseconds = details.updateTime.seconds * 1000;
      setPublishTimeStamp(details.updateTime);
      setYearPublish(new Date(publishMilliseconds).getFullYear());
      setMonthPublish(new Date(publishMilliseconds).getMonth() + 1);
      setDatePublish(new Date(publishMilliseconds).getDate());
    }

    //deadline
    if (details.deadline) {
      const deadlineMilliseconds = details.deadline.seconds * 1000;
      setDeadlineTimeStamp(details.deadline);
      setYearDeadline(new Date(deadlineMilliseconds).getFullYear());
      setMonthDeadline(new Date(deadlineMilliseconds).getMonth() + 1);
      setDateDeadline(new Date(deadlineMilliseconds).getDate());
    }
  }, [isEditing]);

  function editIssue(e) {
    e.preventDefault();
    setEditing(true);
  }

  function cancelEditing(e) {
    e.preventDefault();
    setEditing(false);
  }

  function getTopic(e) {
    setTopic(e.currentTarget.value);
  }

  function getPublisher(e) {
    setAuthor(e.currentTarget.value);
  }

  function getContent(e) {
    setContent(e.currentTarget.value);
  }

  function updatePublishDate(year, month, date) {
    const seconds = transferToFirebaseTimeStamp(year, month, date);
    setPublishTimeStamp(seconds);
    setYearPublish(year);
    setMonthPublish(month);
    setDatePublish(date);
  }

  function updateDeadline(year, month, date) {
    const seconds = transferToFirebaseTimeStamp(year, month, date);
    setDeadlineTimeStamp(seconds);
    setYearDeadline(year);
    setMonthDeadline(month);
    setDateDeadline(date);
  }

  function saveEditing() {
    const data = {
      author: author,
      content: content,
      deadline: deadlineTimeStamp,
      topic: topic,
      updateTime: publishTimeStamp,
    };
    if (
      topicInput.current.value === "" ||
      authorInput.current.value === "" ||
      contentInput.current.value === ""
    ) {
      setAlertbox(true);
      setAlertMessage("欄位不可留空");
    } else {
      updateDocById("board", details.issueId, data).then((result) => {
        if (result === true) {
          setSuccessAlert(true);
          setSuccessMessage("公告更新成功");

          window.setTimeout(() => {
            setEditing(false);
          }, 1200);

          //back to default
          setAuthor("");
          setTopic("");
          setContent("");
          setPublishTimeStamp(0);
          setDeadlineTimeStamp(0);
        } else {
          setAlertbox(true);
          setAlertMessage("公告更新失敗，請重新操作");
        }
      });
    }
  }

  useEffect(() => {
    setEditing(false);
  }, [props.details]);

  if (details?.topic) {
    if (isEditing === false) {
      return (
        <div className={styles.matterDetails}>
          <div className={styles.detailHeader}>
            <h4>{details.topic}</h4>
            <button className={styles.editBtn} onClick={editIssue}>
              <img src={editIcon} />
            </button>
            <button className={styles.trashImg} onClick={props.deleteIssue}>
              <img src={trashIcon} />
            </button>
          </div>
          <p className={styles.detailAuthor}>發布者：{details.author}</p>
          <p className={styles.detailDate}>
            公告日期：{showDate(details.updateTime.seconds)}
          </p>
          <p className={styles.detailDeadline}>
            公告期限：{showDate(details.deadline.seconds)}
          </p>
          <p className={styles.content}>{details.content}</p>
        </div>
      );
    } else {
      return (
        <div className={styles.matterDetailsEdit}>
          <div className={styles.detailHeader}>
            <input
              ref={topicInput}
              className={styles.topicInput}
              type="text"
              value={topic}
              onChange={getTopic}
            ></input>
            <button className={styles.doneBtn} onClick={saveEditing}>
              <img src={doneIcon} />
            </button>
            <button className={styles.cancelBtn} onClick={cancelEditing}>
              <img src={cancelIcon} />
            </button>
          </div>
          <div className={styles.issueInfo}>
            <p className={styles.detailAuthor}>發布者：</p>
            <input
              ref={authorInput}
              className={styles.authorInput}
              type="text"
              value={author}
              onChange={getPublisher}
            ></input>
            <p className={styles.detailDate}>公告日期：</p>
            <div className={styles.detailDateInput}>
              <SmallCalendar
                updateDate={updatePublishDate}
                year={yearPublish}
                month={monthPublish}
                date={datePublish}
              />
            </div>

            <p className={styles.detailDeadline}>公告期限：</p>
            <div className={styles.detailDeadlineInput}>
              <SmallCalendar
                updateDate={updateDeadline}
                year={yearDeadline}
                month={monthDeadline}
                date={dateDeadline}
              />
            </div>

            <p className={styles.detailContent}>公告內容：</p>
            <textarea
              ref={contentInput}
              className={styles.detailContentInput}
              type="text"
              value={content}
              onChange={getContent}
            ></textarea>
          </div>
          {showAlertbox && (
            <Alertbox
              category="downward"
              alertMessage={alertMessage}
              closeAlert={() => {
                setAlertbox(false);
              }}
            />
          )}
          {showSuccessAlert && (
            <AlertSuccessMsg successMessage={successMessage} />
          )}
        </div>
      );
    }
  } else {
    return <div></div>;
  }
}
