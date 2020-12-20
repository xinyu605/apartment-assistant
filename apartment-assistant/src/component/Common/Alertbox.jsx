import React, { useRef } from "react";
import styles from "./Alertbox.module.scss";
import warning from "./../../img/warning.svg";

export default function Alertbox(props) {
  const alertBox = useRef(null);

  if (props.showAlert === true) {
    return (
      <div ref={alertBox} className={styles.alertbox}>
        <div className={styles.alertIcon}>
          <img src={warning} />
        </div>
        <p className={styles.messageText}>資料尚未填寫完成！</p>
        <div className={styles.btnWrapper}>
          <button className={styles.alertBtn} onClick={props.closeAlert}>
            繼續填寫
          </button>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
