import React, { useEffect, useState } from "react";
import ApplyTable from "./../Common/ApplyTable";
import AlertDownward from "./../Common/AlertDownward";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import ConfirmMsg from "./../Common/ConfirmMsg";
import ScrollToTopBtn from "./../Common/ScrollToTopBtn";
import UserApplyForm from "./UserApplyForm";
import {
  getExistedOrders,
  uploadFieldOrder,
  deleteDocById,
} from "./../../firebase";
import styles from "./Field.module.scss";
import calendarIcon from "./../../img/calendar.svg";
import { checkEmailFormat, checkUserName } from "./../../utils/lib";

export default function Field(props) {
  const [timeTitle, setTimeTitle] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [orderRecord, setOrderRecord] = useState([]);
  const [field, setField] = useState("交誼廳");
  const [isApplying, setApplying] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState("");

  // alert dialogs
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  /************************* 
    show weekly date choice
  **************************/
  useEffect(() => {
    const thisField = document.querySelector("#selectField").value;
    setOrderRecord([]);

    /********************** 
      Render weekly title 
    ***********************/
    for (let i = 0; i < 7; i++) {
      // const optionDay = document.querySelector(`#day${i}`);
      const tableDay = document.querySelector(`#tday${i}`);
      let days = new Date();
      let milliseconds = days.getTime() + 86400000 * i; //get milliseconds of the day
      days.setTime(milliseconds);
      let year = days.getFullYear();
      let month = days.getMonth() + 1;
      let date = days.getDate(); //type: number
      let day = days.getDay();
      if (month.toString().length < 2) {
        month = `0${month.toString()}`;
      }
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

      tableDay.innerHTML = `${month}/${date}<br/>${day}`;

      /************************************
        get exsisted orders from firebase
      *************************************/
      getExistedOrders(`${year}`, `${month}`, `${date}`, thisField, getOrders);

      function getOrders(data) {
        // console.log(i, data);
        setOrderRecord((prevState) => [...prevState, data]);
      }
    }
  }, [field, cancelOrderId]);

  /***************************************** 
    create table elements with specific id
  ******************************************/
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

    setTimeTitle(timeTitle);
    setTimeTable(timeTable);
  }, []);

  /******************************************* 
  Click order button to submit orderList
********************************************/

  function openApplyForm(e) {
    e.preventDefault();
    setApplying(true);
  }

  function closeApplyForm(e) {
    e.preventDefault();
    setApplying(false);
  }

  function getApplicantInfo(e) {
    e.preventDefault();
    let orderList = [];
    let data = [];
    let checkResult = false;
    const orderBoxes = document.querySelectorAll("input[type=checkbox]");
    const selectedField = document.querySelector("#selectField");
    const applicantName = document.querySelector("#applicantName").value;
    const applicantEmail = document.querySelector("#applicantEmail").value;

    // Collect checked list
    const checkNameResult = checkUserName(applicantName);
    const checkEmailResult = checkEmailFormat(applicantEmail);
    for (let i = 0; i < orderBoxes.length; i++) {
      if (orderBoxes[i].checked === true) {
        orderList = [
          ...orderList,
          {
            date: orderBoxes[i].id.slice(5, 13),
            time: orderBoxes[i].id.slice(13),
          },
        ];
      }
    }

    /***************************** 
      Check inputs and checkboxes
    ******************************/
    if (
      checkNameResult === "姓名欄位不可留空" ||
      checkEmailResult === "Email欄位不可留空"
    ) {
      setAlertDownward(true);
      setAlertDownwardMessage("欄位不可留空");
    } else if (checkEmailResult === "Email格式錯誤") {
      setAlertDownward(true);
      setAlertDownwardMessage(checkEmailResult);
    } else if (orderList.length === 0) {
      setAlertDownward(true);
      setAlertDownwardMessage("尚未勾選租借時段");
    } else {
      setUserName(applicantName);
      setUserEmail(applicantEmail);
      setOrderList(orderList);
      checkResult = true;
    }

    if (checkResult) {
      // 1. prepare data to upload firebase
      for (let i = 0; i < orderList.length; i++) {
        data[i] = {
          user: applicantName,
          userEmail: applicantEmail,
          field: selectedField.value,
          date: orderList[i].date,
          startTime: orderList[i].time,
        };
      }
      // console.log(data);

      // 2. pass data to firebase
      uploadFieldOrder(data);

      // 3. remind user apply successful
      setSuccessAlert(true);
      setSuccessMessage(`${selectedField.value}預約成功！`);
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      window.setTimeout(() => {
        setApplying(false);
      }, 2001);

      // 4. clear all checkbox and let values back to default (except for field)
      for (let i = 0; i < orderBoxes.length; i++) {
        orderBoxes[i].checked = false;
      }
      setUserName("");
      setUserEmail("");
      setOrderList([]);
    }
  }

  /*******************************************
    Cancel order and update Order record
  ********************************************/

  function cancelOrder(e) {
    const cancelDate = e.currentTarget.id.slice(13, 21);
    const cancelTime = e.currentTarget.id.slice(21);
    let selectedOrderId = "";
    // console.log(cancelDate, cancelTime);
    for (let i = 0; i < orderRecord.length; i++) {
      for (let j = 0; j < orderRecord[i].length; j++) {
        if (
          orderRecord[i][j].date === cancelDate &&
          orderRecord[i][j].startTime === cancelTime
        ) {
          selectedOrderId = orderRecord[i][j].orderId;
        }
      }
    }
    console.log(selectedOrderId);
    setCancelOrderId(selectedOrderId);
    setShowDeleteOrderConfirm(true);
    setConfirmMessage("是否確定取消預借？");
  }

  function confirmCancelOrder() {
    deleteDocById("field", cancelOrderId).then((result) => {
      if (result) {
        setSuccessAlert(true);
        setSuccessMessage("已取消預借");
        window.setTimeout(() => {
          setCancelOrderId("");
          setShowDeleteOrderConfirm(false);
        }, 2000);
        window.setTimeout(() => {
          setSuccessAlert(false);
        }, 2001);
      } else {
        setAlertDownward(true);
        setAlertDownwardMessage("取消預借失敗，請重新操作");
      }
    });
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    setAlertDownward(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowDeleteOrderConfirm(false);
  }

  return (
    <div className={styles.fieldPage}>
      <div className={styles.titleContainer}>
        <div className={styles.imgWrapper}>
          <img src={calendarIcon} />
        </div>
        <h2 className={styles.title}>場地租借紀錄</h2>
      </div>
      <form className={styles.fieldApply}>
        <label className={styles.applyTitle}>場地</label>
        <select
          id="selectField"
          className={styles.selectField}
          onChange={(e) => {
            setField(e.currentTarget.value);
          }}
        >
          <option value="交誼廳">交誼廳</option>
          <option value="會議室">會議室</option>
          <option value="KTV包廂">KTV包廂</option>
          <option value="籃球場A">籃球場A</option>
          <option value="籃球場B">籃球場B</option>
        </select>

        <button
          id="orderBtn"
          className={styles.orderBtn}
          onClick={openApplyForm}
        >
          新增
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
        <ApplyTable
          userEmail={props.userEmail}
          timeTable={timeTable}
          timeTitle={timeTitle}
          orderRecord={orderRecord}
          field={field}
          cancelOrder={cancelOrder}
        />
      </div>
      <UserApplyForm
        isApplying={isApplying}
        closeApplyForm={closeApplyForm}
        getApplicantInfo={getApplicantInfo}
      />
      <AlertDownward
        showAlertDownward={showAlertDownward}
        alertDownwardMessage={alertDownwardMessage}
        closeAlert={closeAlert}
      />
      <AlertSuccessMsg
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
        closeAlert={closeAlert}
      />
      <ConfirmMsg
        showConfirm={showDeleteOrderConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmCancelOrder}
        cancelConfirm={cancelConfirm}
      />
      <ScrollToTopBtn />
    </div>
  );
}
