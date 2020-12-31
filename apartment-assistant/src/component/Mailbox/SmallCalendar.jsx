import React, { useEffect, useState, useRef } from "react";
import styles from "./SmallCalendar.module.scss";
import { showCalendar, checkYearInput } from "./../../utils/lib";
import edit from "./../../img/edit.svg";

/************************
 SmallCalendar component 
*************************/
export function SmallCalendar(props) {
  const [isCalendarShowing, setCalendarShowing] = useState(false);
  const [thisYear, setThisYear] = useState(props.year);
  const [thisMonth, setThisMonth] = useState(props.month);
  const [receiveDate, setReceiveDate] = useState(props.date);

  const containerElement = useRef(null);
  const remindYear = useRef(null);

  // back to default date by props
  useEffect(() => {
    setThisYear(props.year);
    setThisMonth(props.month);
    setReceiveDate(props.date);
  }, [props.year, props.month, props.date]);

  // send initial date to UpdateMailList at beginning
  useEffect(() => {
    props.updateReceiveDate(thisYear, thisMonth, receiveDate);
  }, []);

  // send updated date to UpdateMailList when selected date changing
  useEffect(() => {
    props.updateReceiveDate(thisYear, thisMonth, receiveDate);
  }, [isCalendarShowing, thisYear, thisMonth, receiveDate]);

  function toggleCalendar(e) {
    e.preventDefault();
    isCalendarShowing ? setCalendarShowing(false) : setCalendarShowing(true);
  }

  function updateYear(e) {
    let result = checkYearInput(e.currentTarget.value);
    if (result === false) {
      remindYear.current.style.opacity = "1";
      remindYear.current.textContent = "請填寫四位數字";
    } else {
      remindYear.current.style.opacity = "0";
      setThisYear(parseInt(e.currentTarget.value));
    }
  }

  function hideRemind(e) {
    let result = checkYearInput(e.currentTarget);
    if (result) {
      remindYear.current.style.opacity = "0";
    }
  }

  function updateMonth(e) {
    setThisMonth(parseInt(e.currentTarget.value));
  }

  function selectDate(e) {
    // console.log(e.currentTarget.id.slice(4));
    const date = e.currentTarget.id.slice(4);
    const days = document.querySelectorAll(".day");
    for (let i = 0; i < days.length; i++) {
      days[i].classList.remove(styles.initial, styles.current);
    }
    e.currentTarget.classList.add(styles.current);
    setReceiveDate(parseInt(date));
  }

  // show the small calendar of selected month
  useEffect(() => {
    if (isCalendarShowing) {
      const containerElement = document.querySelector("#calendar");
      showCalendar(containerElement, thisYear, thisMonth);
      const selectMonth = containerElement.querySelectorAll("option");
      selectMonth[thisMonth - 1].setAttribute("selected", true);
    }
  }, [isCalendarShowing, thisYear, thisMonth]);

  // show today's date at beginning
  useEffect(() => {
    if (isCalendarShowing) {
      const selectDay = document.querySelector(`#date${receiveDate}`);
      // console.log(selectDay);
      selectDay.classList.add(styles.initial);
    }
  }, [isCalendarShowing]);

  // add "click" eventListener to each date
  useEffect(() => {
    if (isCalendarShowing) {
      const days = document.querySelectorAll(".day");
      for (let i = 0; i < days.length; i++) {
        days[i].addEventListener("click", selectDate);
      }
    }
  }, [isCalendarShowing, thisYear, thisMonth]);

  if (isCalendarShowing) {
    return (
      <div className={styles.selectReceiveTime}>
        <div className={`${styles.item} ${styles.item5}`}>
          {thisYear}年{thisMonth}月{receiveDate}日
        </div>

        <div className={styles.calendar} id="calendar">
          <div className={styles.title} id="calendarTitle">
            <input
              className={styles.year}
              type="text"
              placeholder={thisYear.toString()}
              id="year"
              onChange={updateYear}
              onBlur={hideRemind}
            ></input>

            <select className={styles.month} id="months" onChange={updateMonth}>
              <option value="1">1 月</option>
              <option value="2">2 月</option>
              <option value="3">3 月</option>
              <option value="4">4 月</option>
              <option value="5">5 月</option>
              <option value="6">6 月</option>
              <option value="7">7 月</option>
              <option value="8">8 月</option>
              <option value="9">9 月</option>
              <option value="10">10 月</option>
              <option value="11">11 月</option>
              <option value="12">12 月</option>
            </select>
            <button className={styles.decideDate} onClick={toggleCalendar}>
              確定
            </button>
            <div ref={remindYear} className={styles.remindYear}></div>
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
      <div className={styles.selectReceiveTime}>
        {thisYear}年{thisMonth}月{receiveDate}日
        <button
          type="button"
          className={styles.editBtn}
          onClick={toggleCalendar}
        >
          <img src={edit} />
        </button>
      </div>
    );
  }
}
