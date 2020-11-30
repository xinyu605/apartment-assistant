export function showDate(seconds) {
  // console.log(seconds);
  let num = seconds * 1000; //得到毫秒數
  let dd = new Date(num);
  let year = dd.getFullYear();
  let month = dd.getMonth() + 1;
  let date = dd.getDate();
  // console.log(`${year}年${month}月${date}日`);
  return `${year}年${month}月${date}日`;
}

export function showCalendar(element, getYear, getMonth) {
  //1.create months in normal year and olympic year
  const monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthOlympic = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  //2.create variables for DOM elements
  // console.log(element);
  const dateContainer = document.querySelector("#date");
  dateContainer.innerHTML = "";

  //4.get what day is the first day in the selected month
  const firstDay = dayStart(getYear, getMonth);
  // console.log(firstDay); //return 0 means Sunday

  //5.get the total days in this month
  const totalDaysThisMonth = daysMonth(
    getYear,
    getMonth,
    monthOlympic,
    monthNormal
  );
  // console.log(totalDaysThisMonth);

  //6.render
  //在當月第一天前面建立空白的<li>
  for (let i = 0; i < firstDay; i++) {
    let blankDays = document.createElement("li");
    dateContainer.appendChild(blankDays);
  }
  //填滿當月日期
  for (let i = 1; i <= totalDaysThisMonth; i++) {
    let date = document.createElement("li");
    date.id = `date${i}`;
    date.classList.add("day");
    date.innerHTML = i;
    dateContainer.appendChild(date);
  }
}

function dayStart(year, month) {
  const tmpDate = new Date(year, month - 1, 1); //當年當月1日
  return tmpDate.getDay();
}

function daysMonth(year, month, monthOlympic, monthNormal) {
  const tmpYear = year % 4;
  if (tmpYear === 0) {
    return monthOlympic[month - 1]; //回傳閏年的當月天數
  } else {
    return monthNormal[month - 1]; //回傳正常年的當月天數
  }
}

export function scrollToTarget(targetId) {
  const target = document.querySelector(`#${targetId}`);
  target.scrollIntoView({ behavior: "smooth" });
}

export function checkEmailFormat(string) {
  if (
    string.search(
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    ) !== -1
  ) {
    return true;
  } else if (string.length === 0) {
    alert("Email欄位不可留空，請重新輸入！");
  } else {
    alert("Email格式錯誤，請重新輸入！");
  }
}

export function checkPasswordLength(string) {
  if (string.length >= 6) {
    return true;
  } else {
    alert("密碼需超過6個字元，請重新輸入！");
  }
}
