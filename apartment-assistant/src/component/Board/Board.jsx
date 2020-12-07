import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import UpdateBoardList from "./UpdateBoardList";
import { getBoardList } from "./../../firebase";
import { showDate } from "./../../lib";
import styles from "./Board.module.scss";
import announcement from "./../../img/promotion.svg";
import readMore from "./../../img/next.svg";

export default function Board() {
  const [matters, setMatters] = useState([]);
  const [details, setDetails] = useState({});

  useEffect(() => {
    getBoardList().then((boardList) => {
      setMatters(boardList);
      setDetails(boardList[0]);
    });
  }, []);

  const List = matters.map((matter) => {
    const updateTime = showDate(matter.updateTime.seconds);
    const index = matters.indexOf(matter);
    return (
      <li className={styles.matter} key={nanoid()}>
        <p className={styles.matterDate}>{updateTime}</p>
        <h4 className={styles.matterTitle}>{matter.topic}</h4>
        <button
          id={`showDetailBtn${index}`}
          className={styles.readMoreBtn}
          onClick={selectMatterDetail}
        >
          <img src={readMore} />
        </button>
      </li>
    );
  });

  const detailArea = () => {
    if (details.topic) {
      return (
        <div className={styles.matterDetails}>
          <h4>{details.topic}</h4>
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
      return <div className={styles.matterDetails}></div>;
    }
  };

  function selectMatterDetail(e) {
    // console.log(e.currentTarget.id.slice(13));
    const index = parseInt(e.currentTarget.id.slice(13));
    setDetails(matters[index]);

    //change styles
    const allMatters = document.querySelectorAll(`.${styles.matter}`);
    const matter = allMatters[index];
    allMatters.forEach((item) => {
      item.classList.remove(styles.currentMatter);
    });
    matter.classList.add(styles.currentMatter);
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
        <div className={styles.anouncement}>
          <h3 className={styles.title}>近期公告</h3>
          <ul className={styles.announcementList}>{List}</ul>
        </div>
        {detailArea()}
      </div>
      <UpdateBoardList />
    </div>
  );
}
