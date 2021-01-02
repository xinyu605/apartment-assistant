import React from "react";
import stylesA from "./Alertbox.module.scss";
import stylesB from "./AlertboxForMailbox.module.scss";
import stylesC from "./AlertDownward.module.scss";
import warning from "./../../img/warning.svg";
import smile from "./../../img/smile.svg";

export default function Alertbox(props) {
  let styles;
  let buttonText;
  switch (props.category) {
    case "updateBoard":
      styles = stylesA;
      break;
    case "updateResident":
      styles = stylesA;
      break;
    case "updateMailbox":
      styles = stylesB;
      break;
    default:
      styles = stylesC;
  }

  if (
    props.category === "updateBoard" ||
    props.category === "updateResident" ||
    props.category === "updateMailbox"
  ) {
    buttonText = "繼續填寫";
  } else {
    buttonText = "確定";
  }

  const alertIcon = props.category === "logout" ? smile : warning;

  return (
    <div className={styles.alertbox}>
      <div className={styles.alertIcon}>
        <img src={alertIcon} />
      </div>
      <p className={styles.messageText}>{props.alertMessage}</p>
      <div className={styles.btnWrapper}>
        <button
          id="closeAlertBtn"
          className={styles.alertBtn}
          onClick={props.closeAlert}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
