import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import DetailArea from "./DetailArea";
import ConfirmMsg from "./../Common/ConfirmMsg";
import ScrollToTopBtn from "./../Common/ScrollToTopBtn";
import UpdateBoardList from "./UpdateBoardList";
import { getBoardList, deleteDocById } from "./../../firebase";
import { showDate } from "./../../utils/lib";
import styles from "./Board.module.scss";
import announcement from "./../../img/promotion.svg";
import boardIcon from "./../../img/blackboard.svg";

export default function Board() {
  const [matters, setMatters] = useState([]);
  const [matterStatus, setMatterStatus] = useState([]);
  const [details, setDetails] = useState({});
  const [issueIndex, setIssueIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    const issues = getBoardList(handleBoardList);
    function handleBoardList(boardList) {
      setMatters(boardList);
      setDetails(boardList[0]);

      const currentMatterStatus = [...matterStatus];
      for (let i = 0; i < boardList.length; i++) {
        currentMatterStatus.push(false);
        setMatterStatus(currentMatterStatus);
      }
    }
    return () => {
      issues();
    };
  }, []);

  function updateMatterStatus(index) {
    const currentMatterStatus = [];
    for (let i = 0; i < matterStatus.length; i++) {
      currentMatterStatus[i] = i === index ? true : false;
    }
    return currentMatterStatus;
  }

  function selectMatterDetail(e) {
    const index = parseInt(e.currentTarget.id.slice(13));
    setIssueIndex(index);
    setDetails(matters[index]);
    Promise.all(updateMatterStatus(index)).then((currentMatterStatus) => {
      setMatterStatus(currentMatterStatus);
    });
  }

  function deleteIssue(e) {
    e.preventDefault();
    setShowDeleteConfirm(true);
    setConfirmMessage("刪除後無法復原，確定嗎？");
  }

  function confirmDelete(e) {
    e.preventDefault();
    let issueList = [...matters];
    let removeIssue = issueList.splice(issueIndex, 1);
    setMatters(issueList);
    setDetails(issueList[0]);
    deleteDocById("board", removeIssue[0].issueId);
    setShowDeleteConfirm(false);
  }

  return (
    <div className={styles.boardPage}>
      <div className={styles.boardList}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={announcement} />
          </div>
          <h2 className={styles.title}>社區公告</h2>
        </div>
        <Announcement
          matters={matters}
          matterStatus={matterStatus}
          selectMatterDetail={selectMatterDetail}
        />
        <DetailArea details={details} deleteIssue={deleteIssue} />
      </div>
      <UpdateBoardList />
      {showDeleteConfirm && (
        <ConfirmMsg
          confirmMessage={confirmMessage}
          confirmAction={confirmDelete}
          cancelConfirm={() => {
            setShowDeleteConfirm(false);
          }}
        />
      )}

      <ScrollToTopBtn />
    </div>
  );
}

function Announcement(props) {
  const matters = props.matters;

  if (matters.length === 0) {
    return (
      <div className={styles.emptyAnnouncement}>
        <div className={styles.imgWrapper}>
          <img src={boardIcon} />
        </div>
        <div className={styles.emptyText}>近期無公告</div>
        <div className={styles.circles}>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.anouncement}>
        <h3 className={styles.title}>近期公告</h3>
        <ul className={styles.announcementList}>
          {matters.map((matter) => {
            return (
              <List
                key={`matter${matter.issueId}`}
                matters={matters}
                matter={matter}
                matterStatus={props.matterStatus}
                selectMatterDetail={props.selectMatterDetail}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}

function List(props) {
  const updateTime = showDate(props.matter.updateTime.seconds);
  const index = props.matters.indexOf(props.matter);
  const matterStatus = props.matterStatus[index];
  return (
    <li
      className={
        matterStatus
          ? `${styles.matter} ${styles.currentMatter}`
          : styles.matter
      }
      key={nanoid()}
    >
      <p className={styles.matterDate}>{updateTime}</p>
      <h4 className={styles.matterTitle}>{props.matter.topic}</h4>
      <button
        id={`showDetailBtn${index}`}
        className={
          matterStatus
            ? `${styles.readMoreBtn} ${styles.currentReadMoreBtn}`
            : styles.readMoreBtn
        }
        onClick={props.selectMatterDetail}
      ></button>
    </li>
  );
}
