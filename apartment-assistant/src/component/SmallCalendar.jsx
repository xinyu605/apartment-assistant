import React, { useEffect, useState } from "react";
import styles from "./SmallCalendar.module.scss";
import { showCalendar, changeDateClass } from "./../lib";

/************************
 SmallCalendar component 
*************************/
export function SmallCalendar() {
  const [isCalendarShowing, setCalendarShowing] = useState(false);
  const [thisMonth, setThisMonth] = useState(new Date().getMonth() + 1);
  // console.log(new Date().getMonth() + 1);
  const [receiveDate, setReceiveDate] = useState(new Date().getDate());

  function toggleCalendar() {
    isCalendarShowing ? setCalendarShowing(false) : setCalendarShowing(true);
  }

  function updateMonth(e) {
    setThisMonth(e.currentTarget.value);
  }

  useEffect(() => {
    if (isCalendarShowing) {
      const containerElement = document.querySelector("#calendar");
      showCalendar(containerElement, thisMonth);
      const selectMonth = containerElement.querySelectorAll("option");
      selectMonth[thisMonth - 1].setAttribute("selected", true);
      const selectDay = document.querySelector(`#date${receiveDate}`);
      // console.log(selectDay);
      selectDay.classList.add(styles.current);
    }
  }, [isCalendarShowing, thisMonth]);

  // useEffect(() => {
  //   if (isCalendarShowing) {
  //     const containerElement = document.querySelector("#calendar");

  //   }
  // });
  // }, [receiveDate]);

  if (isCalendarShowing) {
    return (
      <div>
        <label>寄達日期</label>
        <input
          type="button"
          value="請選擇日期"
          onClick={toggleCalendar}
        ></input>
        <div className={styles.calendar} id="calendar">
          <div className={styles.title}>
            <div className={styles.year} id="year">
              2020
            </div>

            <select className={styles.month} id="months" onChange={updateMonth}>
              <option value="1">1月</option>
              <option value="2">2月</option>
              <option value="3">3月</option>
              <option value="4">4月</option>
              <option value="5">5月</option>
              <option value="6">6月</option>
              <option value="7">7月</option>
              <option value="8">8月</option>
              <option value="9">9月</option>
              <option value="10">10月</option>
              <option value="11">11月</option>
              <option value="12">12月</option>
            </select>
          </div>
          <div className={styles.calendarBody}>
            <ul className={styles.days} id="days">
              <li>日</li>
              <li>一</li>
              <li>二</li>
              <li>三</li>
              <li>四</li>
              <li>五</li>
              <li>六</li>
            </ul>
            <ul className={styles.date} id="date"></ul>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <label>寄達日期</label>
        <input
          type="button"
          value="請選擇日期"
          onClick={toggleCalendar}
        ></input>
      </div>
    );
  }
}
