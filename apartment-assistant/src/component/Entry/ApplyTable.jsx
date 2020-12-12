import React from "react";
import styles from "./ApplyTable.module.scss";

export default function ApplyTable(props) {
  // console.log(props);
  const titleList = props.timeTitle;
  const timeList = props.timeTable;

  /************************************ 
    time titles (first column in table)
  *************************************/
  const TimeTitle = titleList.map((title) => {
    let startTime = title.slice(4);
    let endTime = parseInt(startTime) + 1;
    // console.log(startTime);
    return (
      <div
        className={styles.tableCol1}
        key={`startTime${startTime}`}
      >{`${startTime}:00-${endTime}:00`}</div>
    );
  });

  /************************************ 
    weekly time schedule content
  *************************************/
  const Days = timeList.map((timePerDay) => {
    return timePerDay.map((time) => {
      // console.log(time);
      const orderId = time.slice(4);
      return (
        <div className={styles.daysInTable} id={`${time}`} key={`${time}`}>
          {/* {time} */}
          <label className={styles.orderLabel}>
            <input
              type="checkbox"
              value="ordered"
              id={`order${orderId}`}
              className={styles.orderBox}
            />
            <span></span>
          </label>
        </div>
      );
    });
  });

  return (
    <div className={styles.applyTable}>
      {TimeTitle}
      {Days}
    </div>
  );
}
