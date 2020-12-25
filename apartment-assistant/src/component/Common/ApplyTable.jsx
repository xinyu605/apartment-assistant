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

  /*******************************************
    Get order record and turn into day div Id
  ********************************************/
  useEffect(() => {
    // console.log(props.orderRecord);
    setOrderTimeList([]);
    let newOrderTimeList = [];
    for (let i = 0; i < props.orderRecord.length; i++) {
      for (let j = 0; j < props.orderRecord[i].length; j++) {
        if (props.orderRecord[i][j].length !== 0) {
          let timeInRecord = {
            time: `${props.orderRecord[i][j].date}${props.orderRecord[i][j].startTime}`,
            user: props.orderRecord[i][j].user,
          };
          newOrderTimeList = [...newOrderTimeList, timeInRecord];
          // console.log(newOrderTimeList);
          setOrderTimeList(newOrderTimeList);
        }
      }
    }
  }, [props.orderRecord, props.field]);

  /*********************************************************************
    Render TimePeriod <div> with specific Id organized by date and time
  **********************************************************************/
  return (
    <div className={styles.applyTable}>
      {TimeTitle}
      {timeList.map((timePerDay) => {
        return timePerDay.map((time) => {
          const orderId = time.slice(4);
          return (
            <TimePeriod
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

/******************************************* 
  Render TimePeriod <div> (checkbox | div)
********************************************/
function TimePeriod(props) {
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState("");
  const time = props.time; //ex. time2020121409
  const orderId = props.orderId; //ex. 2020121409
  // console.log(props.orderTimeList);
  useEffect(() => {
    setVisible(true);
    for (let i = 0; i < props.orderTimeList.length; i++) {
      if (orderId === props.orderTimeList[i].time) {
        // console.log(orderId);
        setUser(props.orderTimeList[i].user);
        setVisible(false);
        break;
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
        className={`${styles.daysInTable} ${styles.daysInTableDisable}`}
        id={`${time}`}
      >
        {user}
        <br />
        已借用
      </div>
    );
  }
}
