import React, { useEffect, useState } from "react";
import styles from "./EntryField.module.scss";

export default function EntryField(props) {
  // console.log(props);
  const [timeTitle, setTimeTitle] = useState([]);
  const [timeTable, setTimeTable] = useState([]);

  /************************* 
    show weekly date choice
  **************************/
  useEffect(() => {
    /********************** 
      Render weekly title 
    ***********************/
    for (let i = 0; i < 7; i++) {
      // const optionDay = document.querySelector(`#day${i}`);
      const tableDay = document.querySelector(`#tday${i}`);
      let days = new Date();
      days.setDate(days.getDate() + i); //取得星期"i"的日期
      let month = days.getMonth() + 1;
      let date = days.getDate(); //type: number
      let day = days.getDay();
      if (date.toString().length < 2) {
        date = `0${date.toString()}`;
      }
      // console.log(date, day);
      switch (day) {
        case 0:
          day = "SUN";
          break;
        case 1:
          day = "MON";
          break;
        case 2:
          day = "TUE";
          break;
        case 3:
          day = "WED";
          break;
        case 4:
          day = "THU";
          break;
        case 5:
          day = "FRI";
          break;
        case 6:
          day = "SAT";
          break;
        default:
          break;
      }

      // optionDay.innerHTML = `${month}/${date}`;
      tableDay.innerHTML = `${month}/${date}<br/>${day}`;
    }
  }, []);

  /******************************* 
    create table with specific id
  ********************************/

  useEffect(() => {
    let timeTitle = [];
    let timeTable = [];

    for (let i = 0; i < 13; i++) {
      let time = i + 9;
      if (time.toString().length < 2) {
        time = `0${time}`;
      }
      timeTitle[i] = `time${time}`;
    }

    for (let i = 0; i < 7; i++) {
      let day = new Date();
      let milliseconds = day.getTime() + 86400000 * i; //get milliseconds of the day
      day.setTime(milliseconds);
      let month = day.getMonth() + 1;
      let date = day.getDate();
      timeTable[i] = [];
      for (let j = 0; j < 13; j++) {
        let time = j + 9;
        if (time.toString().length < 2) {
          time = `0${time}`;
        }
        timeTable[i][j] = `time${month}${date}${time}`; // prepare id of each <div> ex. <div id="121109">
      }
    }
    console.log(timeTable);
    console.log(timeTitle);
    setTimeTitle(timeTitle);
    setTimeTable(timeTable);
  }, []);

  function orderField(e) {
    e.preventDefault();
    console.log(document.querySelector("#selectField").value);
    console.log(document.querySelector("#selectDate").value);
    console.log(document.querySelector("#selectTime").value);
    let data = {
      user: props.user,
      userEmail: props.userEmail,
      field: "",
      date: "", // string
      startTime: "", // string
    };
  }

  return (
    <div className={styles.field}>
      <div className={styles.title}>
        <div className={styles.imgWrapper}>img</div>
        <h2>場地租借申請</h2>
      </div>
      <form className={styles.fieldApply}>
        <label className={styles.applyTitle}>場地</label>
        <select id="selectField" className={styles.selectField}>
          <option>交誼廳</option>
          <option>會議室</option>
          <option>K歌房</option>
          <option>籃球場A</option>
          <option>籃球場B</option>
        </select>
        <button id="orderBtn" className={styles.orderBtn} onClick={orderField}>
          預約
        </button>
      </form>
      <div className={styles.fieldTable}>
        <div className={styles.titleWrapper}>
          <div className={styles.tableTitle}></div>
          <div id="tday0" className={styles.tableTitle}></div>
          <div id="tday1" className={styles.tableTitle}></div>
          <div id="tday2" className={styles.tableTitle}></div>
          <div id="tday3" className={styles.tableTitle}></div>
          <div id="tday4" className={styles.tableTitle}></div>
          <div id="tday5" className={styles.tableTitle}></div>
          <div id="tday6" className={styles.tableTitle}></div>
        </div>

        <ApplyTable timeTable={timeTable} timeTitle={timeTitle} />
      </div>
    </div>
  );
}

function ApplyTable(props) {
  console.log(props);
  const titleList = props.timeTitle;
  const timeList = props.timeTable;

  /************************************ 
    time titles (first column in table)
  *************************************/

  const TimeTitle = titleList.map((title) => {
    let startTime = title.slice(4);
    let endTime = parseInt(startTime) + 1;
    console.log(startTime);
    return (
      <div className={styles.tableCol1}>{`${startTime}:00-${endTime}:00`}</div>
    );
  });

  // const FirstDay = timeList[0].map((time) => {
  //   return (
  //     <div className={styles.daysInTable} id={`${time}`}>
  //       day1
  //     </div>
  //   );
  // });

  const Days = timeList.map((timePerDay) => {
    return timePerDay.map((time) => {
      console.log(time);
      return (
        <div
          className={styles.daysInTable}
          id={`${time}`}
          style={{ "font-size": "12px" }}
        >
          {time}
        </div>
      );
    });
  });

  return (
    <div className={styles.applyTable}>
      {TimeTitle}
      {/* {FirstDay} */}
      {Days}
    </div>
  );
}
