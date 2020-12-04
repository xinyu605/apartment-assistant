import React from "react";
import styles from "./ResidentList.module.scss";

export default function ResidentList() {
  return (
    <div className={styles.residentList}>
      <div className={styles.residentDetail}>
        <div>V</div>
        <div className={styles.residentInfo}>
          <div className={`${styles.items} ${styles.item1}`}>
            <div className={styles.itemTitle}>戶號</div>
            <div>201</div>
          </div>
          <div className={`${styles.items} ${styles.item2}`}>
            <div className={styles.itemTitle}>姓名</div>
            <div>201</div>
          </div>
          <div className={`${styles.items} ${styles.item3}`}>
            <div className={styles.itemTitle}>聯絡電話</div>
            <div>0912345678</div>
          </div>
          <div className={`${styles.items} ${styles.item4}`}>
            <div className={styles.itemTitle}>Email</div>
            <div>xinyu@gmail.com</div>
          </div>
          <div className={`${styles.items} ${styles.item5}`}>
            <div className={styles.itemTitle}>地址</div>
            <div>基隆路一段147號3樓</div>
          </div>
          <div className={`${styles.items} ${styles.item6}`}>
            <div className={styles.itemTitle}>更新日期</div>
            <div>2020/12/04</div>
          </div>
        </div>
      </div>
    </div>
  );
}
