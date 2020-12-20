import React from "react";
import styles from "./AlertDownward.module.scss";
import warning from "./../../img/warning.svg";

export default function AlertDownward(props) {
  if (props.showAlertDownward) {
    return (
      <div className={styles.alertbox}>
        <div className={styles.alertIcon}>
          <img src={warning} />
        </div>
        <p className={styles.messageText}>{props.alertDownwardMessage}</p>
        <div className={styles.btnWrapper}>
          <button
            id="closeAlertBtn"
            className={styles.alertBtn}
            onClick={props.closeAlert}
          >
            確定
          </button>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
