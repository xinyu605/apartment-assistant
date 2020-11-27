import React, { useEffect, useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import styles from "./Mailbox.module.scss";
// import PropTypes from "prop-types";
import { getMailList } from "./../firebase";
import { showDate } from "./../lib";

/***************************************************************
 UntakenMailList component: 
 1.Get props data (untakenMails) and render the /Mailbox page
****************************************************************/
function UntakenMailList(props) {
  console.log(props);
  let list = props.list;
  let changeStatus;
  let receiveDate = "";
  changeStatus = list.status ? "未領取" : "已領取";

  if (list.receiveDate) {
    receiveDate = showDate(list.receiveDate.seconds);
  }

  return (
    <div className={styles.untakenMailList}>
      {/* list header */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>img</div>
          <h3 className={styles.title}>信件包裹列表</h3>
        </div>

        <div className={styles.buttonBox}>
          <div className={styles.buttonBackground}></div>
          <div className={`${styles.button} ${styles.current}`}>未領取</div>
          <div className={styles.button}>已領取</div>
        </div>
        <button>新增</button>
      </div>
      {/* list body */}
      <div className={styles.mailList}>
        <div className={styles.tableTitle}>
          <div className="mailNumbers">編號</div>
          <div className="residentNumber">戶號</div>
          <div className="receiver">收件人</div>
          <div className="mailType">信件包裹類型</div>
          <div className="receiveDate">寄達日期</div>
          <div className="place">位置</div>
          <div className="remark">備註</div>
          <div className="status">狀態變更</div>
        </div>
        <div className={styles.list}>
          <div className="mailNumbers">{list.mailNumbers}</div>
          <div className="residentNumber">
            {/* {list.receiver && list.receiver.residentNumbers} */}
            {list.receiver ? list.receiver.residentNumbers : ""}
          </div>
          {list.receiver ? list.receiver.name : ""}
          <div className="mailType">{list.mailType}</div>
          <div className="receiveDate">{receiveDate}</div>
          <div className="place">{list.place}</div>
          <div className="remark">{list.remark}</div>
          <button className="status">{changeStatus}</button>
        </div>
      </div>
    </div>
  );
}

/***************************************************************
 UpdataMailList component 
****************************************************************/
function UpdataMailList() {
  return (
    <div className="updateMailList" id="updateMailList">
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>img</div>
        <h3 className={styles.title}>新增信件包裹</h3>
      </div>
      <div className="updateForm">
        <form>
          <label>編號</label>
          <input type="text" placeholder="請輸入編號"></input>
          <label>戶號</label>
          <input type="text" placeholder="請輸入戶號"></input>
          <label>收件人</label>
          <input type="text" placeholder="請輸入收件人姓名"></input>
          <label>信件包裹類型</label>
          <select>
            <option>普通平信</option>
            <option>普通掛號信</option>
            <option>限時掛號信</option>
            <option>小型包裹</option>
            <option>大型包裹</option>
          </select>
          <SmallCalendar />
        </form>
      </div>
    </div>
  );
}

// /***************************************************************
//  SmallCalendar component
// ****************************************************************/
// function SmallCalendar() {
//   const [isCalendarShowing, setCalendarShowing] = useState(false);
//   function toggleCalendar() {
//     isCalendarShowing ? setCalendarShowing(false) : setCalendarShowing(true);
//   }

//   if (isCalendarShowing) {
//     return (
//       <div>
//         <label>寄達日期</label>
//         <input
//           type="button"
//           value="請選擇日期"
//           onClick={toggleCalendar}
//         ></input>
//         <div>calendar</div>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         <label>寄達日期</label>
//         <input
//           type="button"
//           value="請選擇日期"
//           onClick={toggleCalendar}
//         ></input>
//       </div>
//     );
//   }
// }

/*****************************
 Mailbox component:
 1.Get data from Firestore
 2.Render 
******************************/

function Mailbox() {
  const [data, setData] = useState({});
  // useEffect will run only after an initial render, and after an update on data is occurred
  useEffect(() => {
    getMailList(false).then((mailList) => {
      setData(mailList);
    });
  }, []); //[]內放需要監聽(有變動就要執行function)的state

  return (
    <div>
      <h2>信件包裹紀錄</h2>
      <UntakenMailList list={data} />
      <UpdataMailList />
    </div>
  );
}

// Mailbox.prototypes = {};
export default Mailbox;
