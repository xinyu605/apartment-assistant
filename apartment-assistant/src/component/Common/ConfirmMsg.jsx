import React from "react";
import styles from "./ConfirmMsg.module.scss";
import warning from "./../../img/warning.svg";

export default function ConfirmDeleteMsg(props) {
  if (props.showConfirm === true) {
    return (
      <div className={styles.confirmbox}>
        <div className={styles.confirmIcon}>
          <img src={warning} />
        </div>
        <p className={styles.messageText}>{props.confirmMessage}</p>
        <div className={styles.btnWrapper}>
          <button
            id="yesBtn"
            className={styles.confirmBtn}
            onClick={props.confirmAction}
          >
            確定
          </button>
          <button
            id="noBtn"
            className={styles.confirmBtn}
            onClick={props.cancelConfirm}
          >
            取消
          </button>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
