import React, { useEffect, useState } from "react";
import TimePeriod from "./TimePeriod";
import styles from "./ApplyTable.module.scss";

export default function ApplyTable(props) {
  const titleList = props.timeTitle;
  const timeList = props.timeTable;
  const [orderTimeList, setOrderTimeList] = useState([]);

  useEffect(() => {
    setOrderTimeList([]);
    let newOrderTimeList = [];
    for (let i = 0; i < props.orderRecord.length; i++) {
      for (let j = 0; j < props.orderRecord[i].length; j++) {
        if (props.orderRecord[i][j].length !== 0) {
          let timeInRecord = {
            time: `${props.orderRecord[i][j].date}${props.orderRecord[i][j].startTime}`,
            user: props.orderRecord[i][j].user,
            userEmail: props.orderRecord[i][j].userEmail,
          };
          newOrderTimeList = [...newOrderTimeList, timeInRecord];
          setOrderTimeList(newOrderTimeList);
        }
      }
    }
  }, [props.orderRecord, props.field]);

  return (
    <div className={styles.applyTable}>
      {titleList.map((title) => {
        const startTime = title.slice(4);
        const endTime = parseInt(startTime) + 1;
        return (
          <div
            className={styles.tableCol1}
            key={`startTime${startTime}`}
          >{`${startTime}:00-${endTime}:00`}</div>
        );
      })}
      {timeList.map((timePerDay) => {
        return timePerDay.map((time) => {
          return (
            <TimePeriod
              userEmail={props.userEmail}
              time={time}
              orderId={time.slice(4)}
              orderTimeList={orderTimeList}
              key={time}
              cancelOrder={props.cancelOrder}
              collectCheckedList={props.collectCheckedList}
            />
          );
        });
      })}
    </div>
  );
}
