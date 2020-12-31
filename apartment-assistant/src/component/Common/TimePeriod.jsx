import React, { useState, useEffect, useRef } from "react";
import styles from "./ApplyTable.module.scss";
import cancelBtn from "./../../img/close.svg";

export default function TimePeriod(props) {
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const time = props.time; //ex. time2020121409
  const orderId = props.orderId; //ex. 2020121409
  const button = useRef(null);
  const orderPeriod = useRef(null);

  useEffect(() => {
    setVisible(true);
    for (let i = 0; i < props.orderTimeList.length; i++) {
      if (orderId === props.orderTimeList[i].time) {
        setUser(props.orderTimeList[i].user);
        setUserEmail(props.orderTimeList[i].userEmail);
        setVisible(false);
        break;
      } else {
        setVisible(true);
      }
    }
  }, [props.orderTimeList]);

  if (visible) {
    return (
      <div
        ref={orderPeriod}
        className={styles.daysInTable}
        style={{ backgroundColor: "transparent" }}
        id={`${time}`}
      >
        <label className={styles.orderLabel} id={`label${orderId}`}>
          <input
            type="checkbox"
            value="ordered"
            id={`order${orderId}`}
            className={styles.orderBox}
            onChange={props.collectCheckedList}
          />
          <span></span>
        </label>
      </div>
    );
  } else {
    return (
      <div
        ref={orderPeriod}
        className={`${styles.daysInTable} ${styles.daysInTableDisable}`}
        style={
          props.userEmail === "admin@apartment.com" ||
          props.userEmail === userEmail
            ? { backgroundColor: "#96bbbb" }
            : { backgroundColor: "#bbb" }
        }
        id={`${time}`}
      >
        <button
          ref={button}
          id={`cancelBtn${time}`}
          className={styles.cancelBtn}
          style={
            props.userEmail === "admin@apartment.com" ||
            props.userEmail === userEmail
              ? { display: "flex" }
              : { display: "none" }
          }
          onClick={props.cancelOrder}
        >
          <img src={cancelBtn} />
        </button>
        <div className={styles.text}>
          {user}
          <br />
          已借用
        </div>
      </div>
    );
  }
}
