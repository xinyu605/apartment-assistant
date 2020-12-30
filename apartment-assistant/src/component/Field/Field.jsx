import React, { useEffect, useState, useRef } from "react";
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
import {
  checkEmailFormat,
  checkUserName,
  createTimeTableForField,
  createTimeTitleForField,
  createWeeklyTitle,
} from "./../../utils/lib";

export default function Field(props) {
  const [timeTitle, setTimeTitle] = useState([]);
  const [timeTable, setTimeTable] = useState([]);
  const [weeklyTableTitle, setWeeklyTableTitle] = useState([]);
  const [orderRecord, setOrderRecord] = useState([]);
  const [field, setField] = useState("交誼廳");
  const [isApplying, setApplying] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orderList, setOrderList] = useState([]);
  const [cancelOrderId, setCancelOrderId] = useState("");

  const selectField = useRef(null);

  // alert dialogs
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    const thisField = selectField.current.value;
    setOrderRecord([]);

    const newWeeklyTableTitle = [];
    for (let i = 0; i < 7; i++) {
      const newDay = createWeeklyTitle(i);
      newWeeklyTableTitle.push(newDay);

      getExistedOrders(
        `${newDay.year}`,
        `${newDay.month}`,
        `${newDay.date}`,
        thisField,
        getOrders
      );

      function getOrders(data) {
        setOrderRecord((prevState) => [...prevState, data]);
      }
    }
    setWeeklyTableTitle(newWeeklyTableTitle);
  }, [field, cancelOrderId]);

  useEffect(() => {
    const timeTitle = createTimeTitleForField();
    const timeTable = createTimeTableForField();
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
          ref={selectField}
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
          {weeklyTableTitle.map((dayTitle) => {
            return (
              <div
                className={styles.tableTitle}
                key={`tableTitle${dayTitle.month}${dayTitle.date}`}
              >
                {`${dayTitle.month}/${dayTitle.date}`}
                <br />
                {`${dayTitle.day}`}
              </div>
            );
          })}
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
