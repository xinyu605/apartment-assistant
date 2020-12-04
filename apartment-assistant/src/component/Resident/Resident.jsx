import React from "react";
import ResidentList from "./ResidentList";
import UpdateResident from "./UpdateResident";
import styles from "./Resident.module.scss";

export default function Resident() {
  return (
    <div className={styles.residentPage}>
      <div>
        <div className={styles.title}>
          <h2>住戶資訊</h2>
          <select>
            <option>樓層</option>
          </select>
          <div className={styles.search}>
            <input type="text" placeholder="戶號"></input>
            <button>查詢</button>
          </div>
          <button>刪除</button>
        </div>
        <ResidentList />
      </div>
      <UpdateResident />
    </div>
  );
}
