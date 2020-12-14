import React, { useEffect, useState } from "react";
import styles from "./ApplyTable.module.scss";

export default function ApplyTable(props) {
  // console.log(props.orderRecord);
  const titleList = props.timeTitle;
  const timeList = props.timeTable;
  const [orderTimeList, setOrderTimeList] = useState([]);

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

  /******************************************
    Hide checkbox with order record
  *******************************************/
  useEffect(() => {
    console.log(props.orderRecord);

    for (let i = 0; i < props.orderRecord.length; i++) {
      for (let j = 0; j < props.orderRecord[i].length; j++) {
        if (props.orderRecord[i][j].length !== 0) {
          let timeInRecord = `${props.orderRecord[i][j].date}${props.orderRecord[i][j].startTime}`;
          let newOrderTimeList = [...orderTimeList];
          newOrderTimeList.push(timeInRecord);
          setOrderTimeList(newOrderTimeList);
        }
      }
    }
  }, [props.orderRecord, props.field]);

  return (
    <div className={styles.applyTable}>
      {TimeTitle}
      {timeList.map((timePerDay) => {
        return timePerDay.map((time) => {
          const orderId = time.slice(4);
          return (
            <Day
              time={time}
              orderId={orderId}
              orderTimeList={orderTimeList}
              key={time}
            />
          );
        });
      })}
    </div>
  );
}

/************************************ 
    weekly time schedule content
  *************************************/

function Day(props) {
  const [visible, setVisible] = useState(true);
  const time = props.time; //ex. time2020121409
  const orderId = props.orderId; //ex. 2020121409

  useEffect(() => {
    for (let i = 0; i < props.orderTimeList.length; i++) {
      if (orderId === props.orderTimeList[i]) {
        console.log(orderId);
        setVisible(false);
      } else {
        setVisible(true);
      }
    }
  }, [props.orderTimeList]);

  if (visible) {
    return (
      <div className={styles.daysInTable} id={`${time}`}>
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
  } else {
    return (
      <div
        className={styles.daysInTable}
        id={`${time}`}
        style={{ backgroundColor: "#618985", color: "#fff", fontSize: "12px" }}
      >
        已外借
      </div>
    );
  }
}
