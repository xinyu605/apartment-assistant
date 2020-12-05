import React from "react";
import ResidentList from "./ResidentList";
import UpdateResident from "./UpdateResident";
import styles from "./Resident.module.scss";
import headerImg from "./../../img/home.svg";
import searchImg from "./../../img/search.svg";

export default function Resident() {
  return (
    <div className={styles.residentPage}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={headerImg} />
          </div>
          <h3 className={styles.title}>住戶資訊</h3>
        </div>

        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="戶號"
          ></input>
          <div className={styles.searchButton}>
            <img src={searchImg} />
          </div>
        </div>
      </div>

      <ResidentList />

      <UpdateResident />
    </div>
  );
}
