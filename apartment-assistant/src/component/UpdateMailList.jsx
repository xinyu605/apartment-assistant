import React from "react";
import { SmallCalendar } from "./SmallCalendar";
import styles from "./UpdateMailList.module.scss";

export function UpdateMailList() {
  return (
    <div className={styles.updateMailList} id="updateMailList">
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>img</div>
          <h3 className={styles.title}>新增信件包裹</h3>
        </div>
      </div>
      <div className={styles.updateForm}>
        <form>
          <label className={styles.itemTitle1}>編號</label>
          <input
            className={styles.item}
            type="text"
            placeholder="請輸入編號"
          ></input>
          <label className={styles.itemTitle2}>戶號</label>
          <input
            className={styles.item}
            type="text"
            placeholder="請輸入戶號"
          ></input>
          <label className={styles.itemTitle3}>收件人</label>
          <input
            className={styles.item}
            type="text"
            placeholder="請輸入收件人姓名"
          ></input>
          <label className={styles.itemTitle1}>信件包裹類型</label>
          <select className={styles.item}>
            <option>普通平信</option>
            <option>普通掛號信</option>
            <option>限時掛號信</option>
            <option>小型包裹</option>
            <option>大型包裹</option>
          </select>
          <label className={styles.itemTitle2}>寄達日期</label>
          <SmallCalendar />
          <label className={styles.itemTitle3}>位置</label>
          <select className={styles.item}>
            <option>信箱</option>
            <option>置物櫃</option>
            <option>管理室</option>
          </select>
          <label className={styles.itemTitle1}>狀態</label>
          <select className={styles.item}>
            <option>未領取</option>
            <option>已領取</option>
          </select>
          <label className={styles.itemTitle2}>備註</label>
          <input
            className={styles.item}
            type="text"
            placeholder="其他注意事項"
          ></input>
        </form>
      </div>
    </div>
  );
}
