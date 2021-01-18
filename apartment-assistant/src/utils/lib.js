export function showDate(seconds) {
  const MILLISECONDS = seconds * 1000;
  const dd = new Date(MILLISECONDS);
  const year = dd.getFullYear();
  const month = dd.getMonth() + 1;
  const date = dd.getDate();
  return `${year}年${month}月${date}日`;
}

export function showCalendar(getYear, getMonth, blockPast = false) {
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth();
  const todayDate = new Date().getDate();
  const todayTime = new Date(todayYear, todayMonth, todayDate).getTime();
  const dateContainer = createDateElements("#date");
  const firstDayInSelectedMonth = dayStartInSelectedMonth(getYear, getMonth);
  const totalDaysThisMonth = daysInThisMonth(getYear, getMonth);

  //在當月第一天前面建立空白的<li>
  for (let i = 0; i < firstDayInSelectedMonth; i++) {
    let blankDays = document.createElement("li");
    dateContainer.appendChild(blankDays);
  }
  //填滿當月日期
  for (let i = 1; i <= totalDaysThisMonth; i++) {
    const selectedTime = new Date(getYear, getMonth - 1, i).getTime();

    let date = document.createElement("li");
    date.id = `date${i}`;
    date.classList.add("day");
    date.innerHTML = i;

    // optional: 阻擋今天以前的舊日期
    if (blockPast && selectedTime < todayTime) {
      date.style.color = "#aaa";
    } else {
      date.style.cursor = "pointer";
    }

    dateContainer.appendChild(date);
  }
}

export function createDateElements(elementId) {
  const dateElement = document.querySelector(elementId);
  dateElement.innerHTML = "";
  return dateElement;
}

export function dayStartInSelectedMonth(year, month) {
  const tmpDate = new Date(year, month - 1, 1); //當年當月1日
  return tmpDate.getDay();
}

export function daysInThisMonth(year, month) {
  const monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthOlympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const tmpYear = year % 4;
  let daysInTheMonth = 0;
  if (tmpYear === 0) {
    daysInTheMonth = monthOlympic[month - 1];
  } else {
    daysInTheMonth = monthNormal[month - 1];
  }
  return daysInTheMonth;
}

export function createWeeklyTitle(index) {
  const days = new Date();
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const milliseconds = days.getTime() + 86400000 * index;
  days.setTime(milliseconds);
  const year = days.getFullYear();
  let month = days.getMonth() + 1;
  month = month.toString();
  let date = days.getDate();
  date = date.toString();
  let day = weekDays[days.getDay()];
  if (month.length < 2) {
    month = `0${month}`;
  }
  if (date.length < 2) {
    date = `0${date}`;
  }
  return { year: year, month: month, date: date, day: day };
}

export function createTimeTitleForField() {
  const timeTitle = [];
  for (let i = 0; i < 13; i++) {
    let time = i + 9;
    if (time.toString().length < 2) {
      time = `0${time}`;
    }
    timeTitle[i] = `time${time}`;
  }
  return timeTitle;
}

export function createTimeTableForField() {
  const timeTable = [];
  for (let i = 0; i < 7; i++) {
    let day = new Date();
    let milliseconds = day.getTime() + 86400000 * i; //get milliseconds of the day
    day.setTime(milliseconds);
    let year = day.getFullYear();
    let month = day.getMonth() + 1;
    let date = day.getDate();
    if (month.toString().length < 2) {
      month = `0${month}`;
    }
    if (date.toString().length < 2) {
      date = `0${date}`;
    }
    timeTable[i] = [];
    for (let j = 0; j < 13; j++) {
      let time = j + 9;
      if (time.toString().length < 2) {
        time = `0${time}`;
      }
      timeTable[i][j] = `time${year}${month}${date}${time}`; // prepare id of each <div> ex. <div id="121109">
    }
  }
  return timeTable;
}

export function scrollToTarget(targetId) {
  const target = document.querySelector(`#${targetId}`);
  target.scrollIntoView({ behavior: "smooth" });
}

export function checkUserName(string) {
  const result = /^\s/.test(string);
  if (string.length === 0) {
    return "姓名欄位不可留空";
  } else if (result === true) {
    return "首字不可留空";
  } else {
    return true;
  }
}

export function checkEmailFormat(string) {
  if (
    string.search(
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    ) !== -1
  ) {
    return true;
  } else if (string.length === 0) {
    return "Email欄位不可留空";
  } else {
    return "Email格式錯誤";
  }
}

export function checkPasswordLength(string) {
  if (string.length >= 6) {
    return true;
  } else {
    return "密碼需超過6個字元";
  }
}

export function checkNumbers(string) {
  let regex = /^(0|[1-9][0-9]*)$/;
  if (string === "") {
    return undefined;
  } else {
    return regex.test(string);
  }
}

export function checkYearInput(string) {
  let regex = /^(\d{4})$/;
  let result = regex.test(string);
  return result;
}

export function checkUserPhone(string) {
  let regex = /^09\d{8}$/;
  let result = regex.test(string);
  if (result === true) {
    return true;
  } else if (string.length === 0) {
    return "手機號碼不可留空";
  } else {
    return "請填寫正確格式，如0912345678";
  }
}
