import React from "react";
import styles from "./Board.module.scss";
import announcement from "./../../img/promotion.svg";
import readMore from "./../../img/next.svg";

export default function Board() {
  return (
    <div className={styles.boardPage}>
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={announcement} />
        </div>
        <h2 className={styles.title}>社區公告</h2>
      </div>
      <div className={styles.anouncement}>
        <h3 className={styles.title}>近期公告</h3>
        <ul className={styles.announcementList}>
          <li className={styles.matter}>
            <p className={styles.matterDate}>2020年12月3日</p>
            <h4 className={styles.matterTitle}>請住戶填寫機車位資料表</h4>
            <button className={styles.readMoreBtn}>
              <img src={readMore} />
            </button>
          </li>

          <li className={styles.matter}>
            <p className={styles.matterDate}>2020年12月3日</p>
            <h4 className={styles.matterTitle}>請住戶填寫機車位資料表</h4>
            <button className={styles.readMoreBtn}>
              <img src={readMore} />
            </button>
          </li>

          <li className={styles.matter}>
            <p className={styles.matterDate}>2020年12月3日</p>
            <h4 className={styles.matterTitle}>請住戶填寫機車位資料表</h4>
            <button className={styles.readMoreBtn}>
              <img src={readMore} />
            </button>
          </li>
        </ul>
      </div>
      <div className={styles.matterDetails}>
        <h4>請住戶填寫機車位資料表</h4>
        <p className={styles.detailDate}>公告日期：2020年12月3日</p>
        <p className={styles.detailDeadline}>公告期限：2020年12月8日</p>
        <p className={styles.content}>
          管委會為確保住(業)戶權益，強化本社區大樓管理特請全體住戶配合建立「機車位資料表」，以俾利門禁管制及社區管理服務。
          請所有住戶至信箱收取「機車位資料表」，一戶填寫一張表格，敬請詳實填寫住戶資料表後於12月30日前交給社區保全。
        </p>
      </div>
    </div>
  );
}
