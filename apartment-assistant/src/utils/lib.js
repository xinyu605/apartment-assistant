export function showDate(seconds) {
  const MILLISECONDS = seconds * 1000;
  const dd = new Date(MILLISECONDS);
  const year = dd.getFullYear();
  const month = dd.getMonth() + 1;
  const date = dd.getDate();
  return `${year}年${month}月${date}日`;
}

export function showCalendar(element, getYear, getMonth, blockPast = false) {
  const todayYear = new Date().getFullYear();
  const todayMonth = new Date().getMonth();
  const todayDate = new Date().getDate();
  const todayTime = new Date(todayYear, todayMonth, todayDate).getTime();
  const monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthOlympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dateContainer = createDateElements("#date");
  const firstDayInSelectedMonth = dayStartInSelectedMonth(getYear, getMonth); //return 0 means Sunday
  const totalDaysThisMonth = daysInThisMonth(
    getYear,
    getMonth,
    monthOlympic,
    monthNormal
  );

  //6.render
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

export function daysInThisMonth(year, month, monthOlympic, monthNormal) {
  const tmpYear = year % 4;
  let daysInTheMonth = 0;
  if (tmpYear === 0) {
    daysInTheMonth = monthOlympic[month - 1];
  } else {
    daysInTheMonth = monthNormal[month - 1];
  }
  return daysInTheMonth;
}

export function scrollToTarget(targetId) {
  const target = document.querySelector(`#${targetId}`);
  target.scrollIntoView({ behavior: "smooth" });
}

export function checkUserName(string) {
  if (string.length === 0) {
    return "姓名欄位不可留空";
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