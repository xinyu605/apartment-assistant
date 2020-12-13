import React from "react";
import styles from "./UserApplyForm.module.scss";
import close from "./../../img/close.svg";
import user from "./../../img/user.svg";
import email from "./../../img/email.svg";

export default function UserApplyForm(props) {
  console.log(props);
  if (props.isApplying) {
    return (
      <div className={styles.userApplyForm}>
        <form className={styles.applicantInfo}>
          <div className={styles.applyTitleWrapper}>
            <h2 className={styles.applyTitle}>請輸入預約者資訊</h2>
            <button
              id="closeApplyBtn"
              className={styles.closeBtn}
              onClick={props.closeApplyForm}
            >
              <img src={close} />
            </button>
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.imgWrapper}>
              <img src={user} />
            </div>
            <input
              id="applicantName"
              type="text"
              name="applicantName"
              placeholder="預約者姓名"
            ></input>
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.imgWrapper}>
              <img src={email} />
            </div>
            <input
              id="applicantEmail"
              type="text"
              name="applicantEmail"
              placeholder="預約者Email"
            ></input>
          </div>

          <button
            id="submitApply"
            className={styles.sendBtn}
            onClick={props.getApplicantInfo}
          >
            送出
          </button>
        </form>
      </div>
    );
  } else {
    return <div></div>;
  }
}
