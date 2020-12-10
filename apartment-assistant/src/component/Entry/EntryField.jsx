import React, { useEffect, useState } from "react";
import styles from "./EntryField.module.scss";

export default function EntryField(props) {
  // console.log(props);
  const [field, setField] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  /************************* 
    show weekly date choice
  **************************/
  useEffect(() => {
    for (let i = 0; i < 7; i++) {
      const optionDay = document.querySelector(`#day${i}`);
      const tableDay = document.querySelector(`#tday${i}`);
      const weekDayList = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      let days = new Date();
      days.setDate(days.getDate() - days.getDay() + i); //取得星期"i"的日期
      let month = days.getMonth() + 1;
      let date = days.getDate();
      optionDay.innerHTML = `${month}/${date}`;
      tableDay.innerHTML = `${month}/${date}<br/>${weekDayList[i]}`;
    }
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
      date: "", // timeStamp
      time: "", // string
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
        <label className={styles.applyTitle}>日期</label>
        <select id="selectDate" className={styles.selectDate}>
          <option id="day0"></option>
          <option id="day1"></option>
          <option id="day2"></option>
          <option id="day3"></option>
          <option id="day4"></option>
          <option id="day5"></option>
          <option id="day6"></option>
        </select>
        <label className={styles.applyTitle}>時間</label>
        <select id="selectTime" className={styles.selectTime}>
          <option value="09">09:00-10:00</option>
          <option value="10">10:00-11:00</option>
          <option value="11">11:00-12:00</option>
          <option value="12">12:00-13:00</option>
          <option value="13">13:00-14:00</option>
          <option value="14">14:00-15:00</option>
          <option value="15">15:00-16:00</option>
          <option value="16">16:00-17:00</option>
          <option value="17">17:00-18:00</option>
          <option value="18">18:00-19:00</option>
          <option value="19">19:00-20:00</option>
          <option value="20">20:00-21:00</option>
        </select>
        <button id="orderBtn" className={styles.orderBtn} onClick={orderField}>
          預約
        </button>
      </form>
      <div className={styles.fieldTable}>
        {/* <div className={styles.tableRow}> */}
        {/* <div className={styles.tableTitle}>日期</div> */}
        <div className={styles.tableTitle}></div>
        <div id="tday0" className={styles.tableTitle}></div>
        <div id="tday1" className={styles.tableTitle}></div>
        <div id="tday2" className={styles.tableTitle}></div>
        <div id="tday3" className={styles.tableTitle}></div>
        <div id="tday4" className={styles.tableTitle}></div>
        <div id="tday5" className={styles.tableTitle}></div>
        <div id="tday6" className={styles.tableTitle}></div>
        {/* </div> */}
        {/* <div className={styles.tableRow}> */}
        <div className={styles.tableCol1}>09:00-10:00</div>
        <div id="week0-09"></div>
        <div id="week1-09"></div>
        <div id="week2-09"></div>
        <div id="week3-09"></div>
        <div id="week4-09"></div>
        <div id="week5-09"></div>
        <div id="week6-09"></div>
        {/* </div> */}
        {/* <div className={styles.tableRow}> */}
        <div className={styles.tableCol1}>10:00-11:00</div>
        <div id="week0-10"></div>
        <div id="week1-10"></div>
        <div id="week2-10"></div>
        <div id="week3-10"></div>
        <div id="week4-10"></div>
        <div id="week5-10"></div>
        <div id="week6-10"></div>
        {/* </div> */}
        {/* <div className={styles.tableRow}> */}
        <div className={styles.tableCol1}>11:00-12:00</div>
        <div id="week0-11"></div>
        <div id="week1-11"></div>
        <div id="week2-11"></div>
        <div id="week3-11"></div>
        <div id="week4-11"></div>
        <div id="week5-11"></div>
        <div id="week6-11"></div>
        {/* </div> */}
        {/* <div className={styles.tableRow}> */}
        <div className={styles.tableCol1}>12:00-13:00</div>
        <div id="week0-12"></div>
        <div id="week1-12"></div>
        <div id="week2-12"></div>
        <div id="week3-12"></div>
        <div id="week4-12"></div>
        <div id="week5-12"></div>
        <div id="week6-12"></div>
        {/* </div> */}
      </div>
    </div>
  );
}
