import React, { useEffect, useState, useRef } from "react";
import ApplyTable from "./../Common/ApplyTable";
import Alertbox from "./../Common/Alertbox";
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
  const [orderApply, setOrderApply] = useState([]);
  const [field, setField] = useState("交誼廳");
  const [isApplying, setApplying] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState("");

  const selectedField = useRef(null);

  const [showAlertbox, setAlertbox] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteOrderConfirm, setShowDeleteOrderConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    const thisField = selectedField.current.value;
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

  function openApplyForm(e) {
    e.preventDefault();
    const checkOrderInputResult = orderApply.length === 0 ? false : true;
    if (checkOrderInputResult) {
      setApplying(true);
    } else {
      setAlertbox(true);
      setAlertMessage("尚未勾選租借時段");
    }
  }

  function closeApplyForm(e) {
    e.preventDefault();
    setApplying(false);
  }

  function collectCheckedList(e) {
    if (e.currentTarget.checked) {
      const newOrderApply = [
        ...orderApply,
        {
          date: e.currentTarget.id.slice(5, 13),
          time: e.currentTarget.id.slice(13),
        },
      ];
      setOrderApply(newOrderApply);
    } else {
      const newOrderApply = orderApply.filter(
        (order) =>
          order.date !== e.currentTarget.id.slice(5, 13) ||
          order.time !== e.currentTarget.id.slice(13)
      );
      setOrderApply(newOrderApply);
    }
  }

  function changeApplicantInfo(e) {
    switch (e.currentTarget.id) {
      case "applicantName":
        setUserName(e.currentTarget.value);
        break;
      case "applicantEmail":
        setUserEmail(e.currentTarget.value);
        break;
      default:
        break;
    }
  }

  function sendApplicantInfo(e) {
    e.preventDefault();

    let checkResult = false;
    let fieldOrders;

    const checkNameResult = checkUserName(userName);
    const checkEmailResult = checkEmailFormat(userEmail);

    if (
      checkNameResult === "姓名欄位不可留空" ||
      checkEmailResult === "Email欄位不可留空"
    ) {
      setAlertbox(true);
      setAlertMessage("欄位不可留空");
    } else if (checkEmailResult === "Email格式錯誤") {
      setAlertbox(true);
      setAlertMessage(checkEmailResult);
    } else {
      fieldOrders = orderApply.map((order) => {
        return {
          user: userName,
          userEmail: userEmail,
          field: selectedField.current.value,
          date: order.date,
          startTime: order.time,
        };
      });
      checkResult = true;
    }

    if (checkResult) {
      uploadFieldOrder(fieldOrders);
      setSuccessAlert(true);
      setSuccessMessage(`${selectedField.current.value}預約成功！`);
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      window.setTimeout(() => {
        setApplying(false);
      }, 2001);

      setUserName("");
      setUserEmail("");
      setOrderApply([]);
    }
  }

  function cancelOrder(e) {
    const cancelDate = e.currentTarget.id.slice(13, 21);
    const cancelTime = e.currentTarget.id.slice(21);
    let selectedOrderId = "";
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
    deleteDocById("field", cancelOrderId);
    setSuccessAlert(true);
    setSuccessMessage("已取消預借");
    window.setTimeout(() => {
      setCancelOrderId("");
      setShowDeleteOrderConfirm(false);
    }, 2000);
    window.setTimeout(() => {
      setSuccessAlert(false);
    }, 2001);
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
          ref={selectedField}
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
          collectCheckedList={collectCheckedList}
        />
      </div>
      {isApplying && (
        <UserApplyForm
          closeApplyForm={closeApplyForm}
          changeApplicantInfo={changeApplicantInfo}
          sendApplicantInfo={sendApplicantInfo}
        />
      )}
      {showAlertbox && (
        <Alertbox
          category="downward"
          alertMessage={alertMessage}
          closeAlert={() => {
            setAlertbox(false);
          }}
        />
      )}
      {showSuccessAlert && <AlertSuccessMsg successMessage={successMessage} />}

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
