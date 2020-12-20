import React from "react";
import styles from "./AlertSuccessMsg.module.scss";
import complete from "./../../img/complete.svg";

export default function AlertSuccessMsg(props) {
  if (props.showSuccessAlert) {
    return (
      <div id="alertSuccessMsg" className={styles.alertbox}>
        <div className={styles.alertIcon}>
          <img src={complete} />
        </div>
        <p className={styles.messageText}>{props.successMessage}</p>
        <div className={styles.btnWrapper}></div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
