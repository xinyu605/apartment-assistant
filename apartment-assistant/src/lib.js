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
