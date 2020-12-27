import React, { useEffect, useState, useRef } from "react";
import { SmallCalendar } from "./SmallCalendar";
import AlertDownward from "./../Common/AlertDownward";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import styles from "./DetailArea.module.scss";
import { showDate } from "./../../lib";
import { getTimeStamp, updateIssue } from "./../../firebase";
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

  //ref
  const topicInput = useRef(null);
  const authorInput = useRef(null);
  const contentInput = useRef(null);

  //alert dialog
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
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

  /*****************************
  get input values
******************************/
  function getTopic(e) {
    setTopic(e.currentTarget.value);
  }

  function getPublisher(e) {
    setAuthor(e.currentTarget.value);
  }

  function getContent(e) {
    setContent(e.currentTarget.value);
  }

  /*****************************
  prepare seconds for firebase
  ******************************/
  function updatePublishDate(year, month, date) {
    const seconds = getTimeStamp(year, month, date);
    setPublishTimeStamp(seconds);
    setYearPublish(year);
    setMonthPublish(month);
    setDatePublish(date);
  }

  function updateDeadline(year, month, date) {
    const seconds = getTimeStamp(year, month, date);
    setDeadlineTimeStamp(seconds);
    setYearDeadline(year);
    setMonthDeadline(month);
    setDateDeadline(date);
  }

  /**************************************
  prepare pass updated data to firebase
  ***************************************/
  function saveEditing() {
    const data = {
      author: author,
      content: content,
      deadline: deadlineTimeStamp,
      issueId: details.issueId,
      topic: topic,
      updateTime: publishTimeStamp,
    };
    if (
      topicInput.current.value === "" ||
      authorInput.current.value === "" ||
      contentInput.current.value === ""
    ) {
      setAlertDownward(true);
      setAlertDownwardMessage("欄位不可留空");
    } else {
      updateIssue(data)
        .then((result) => {
          if (result === true) {
            setSuccessAlert(true);
            setSuccessMessage("公告更新成功");

            window.setTimeout(() => {
              console.log("1");
              setSuccessAlert(false);
            }, 1000);
            window.setTimeout(() => {
              console.log("2");
              setEditing(false);
            }, 700);

            //back to default
            setAuthor("");
            setTopic("");
            setContent("");
            setPublishTimeStamp(0);
            setDeadlineTimeStamp(0);
          } else {
            setAlertDownward(true);
            setAlertDownwardMessage("公告更新失敗，請重新操作");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    setAlertDownward(false);
  }

  useEffect(() => {
    setEditing(false);
  }, [props.details]);

  if (details?.topic) {
    // 避免detail是undefined時網頁報錯
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
    }
  } else {
    return <div></div>;
  }
}
