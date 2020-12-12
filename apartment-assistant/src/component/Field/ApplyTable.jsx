import React, { useEffect } from "react";
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
          <label className={styles.orderLabel} id={`label${orderId}`}>
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

  /********************************************** 
    change the checkbox status with order record
  ***********************************************/
  useEffect(() => {
    const orderRecord = props.orderRecord;
    console.log(orderRecord);
    const selectedField = document.querySelector("#selectField").value;

    for (let i = 0; i < orderRecord.length; i++) {
      // console.log(orderRecord[i]);
      let selectedTime = orderRecord[i].filter(
        (item) => item.field === selectedField
      );
      console.log(selectedTime);
      for (let j = 0; j < selectedTime.length; j++) {
        let divId = `time${selectedTime[j].date}${selectedTime[j].startTime}`;
        let div = document.querySelector(`#${divId}`);
        // let labelId = `label${selectedTime[j].date}${selectedTime[j].startTime}`;
        // let label = document.querySelector(`#${labelId}`);
        let coverBlock = document.createElement("div");
        // coverBlock.textContent = "已外借";
        // coverBlock.classList.add("hideCheckbox");
        // div.insertBefore(coverBlock, label);
        document.querySelector(`#${divId}`).textContent = "已外借";
        document.querySelector(`#${divId}`).style.cssText =
          "background-color:#618985; color: #fff; font-size: 12px";
      }
    }
  }, [props.orderRecord, props.field]);

  return (
    <div className={styles.applyTable}>
      {TimeTitle}
      {Days}
    </div>
  );
}
