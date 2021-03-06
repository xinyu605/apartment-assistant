import React, { useEffect, useRef, useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import Alertbox from "./../Common/Alertbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import { EmailForm } from "./EmailForm";
import styles from "./UpdateMailList.module.scss";
import { uploadMailList, transferToFirebaseTimeStamp } from "./../../firebase";
import { nanoid } from "nanoid";
import envelope from "./../../img/envelope.svg";
import send from "./../../img/send.svg";
import { checkNumbers } from "./../../utils/lib";

export function UpdateMailList(props) {
  const [mailNumber, setMailNumber] = useState("");
  const [residentNumber, setResidentNumber] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverIndex, setReceiverIndex] = useState(0);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [mailType, setMailType] = useState("普通平信");
  const [receiveDate, setReceiveDate] = useState(0);
  const [place, setPlace] = useState("信箱");
  const [remark, setRemark] = useState("無");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersEmail, setFamilyMembersEmail] = useState([]);
  const [isEditingMail, setIsEditingMail] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState(new Date().getDate());

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const mailNumberInput = useRef(null);
  const remindMailNumber = useRef(null);
  const residentNumberInput = useRef(null);
  const remindResidentNumbers = useRef(null);
  const receiverSelect = useRef(null);
  const remarkInput = useRef(null);

  function updateReceiveDate(year, month, date) {
    const seconds = transferToFirebaseTimeStamp(year, month, date);
    setReceiveDate(seconds);
    setYear(year);
    setMonth(month);
    setDate(date);
  }

  function getResidentData(residentNumber) {
    setResidentNumber(residentNumber);
    setFamilyMembers([]);
    setFamilyMembersEmail([]);
    const residentList = props.residentList;
    let familyMembersName = [];
    let familyMembersEmail = [];
    let residentNumberExist = false;
    for (let i = 0; i < residentList.length; i++) {
      if (residentList[i].residentNumbers === residentNumber) {
        residentNumberExist = true;
        for (let j = 0; j < residentList[i].familyMembers.length; j++) {
          familyMembersName = [
            ...familyMembersName,
            residentList[i].familyMembers[j].name,
          ];
          familyMembersEmail = [
            ...familyMembersEmail,
            residentList[i].familyMembers[j].email,
          ];
          setFamilyMembers(familyMembersName);
          setFamilyMembersEmail(familyMembersEmail);
        }
      }
    }
    if (residentNumberExist || residentNumber === "") {
      remindResidentNumbers.current.style.opacity = "0";
      remindResidentNumbers.current.style.height = "0px";
    } else {
      remindResidentNumbers.current.style.opacity = "1";
      remindResidentNumbers.current.style.height = "20px";
    }
  }

  function hideRemind(e) {
    switch (e.currentTarget.id) {
      case "residentNumber":
        if (residentNumber === "") {
          remindResidentNumbers.current.style.opacity = "0";
          remindResidentNumbers.current.style.height = "0px";
        }
        break;
      case "mailNumber":
        if (mailNumber === "") {
          remindMailNumber.current.style.opacity = "0";
          remindMailNumber.current.style.height = "0px";
        }
        break;
      default:
        break;
    }
  }

  function updateHook(e) {
    switch (e.currentTarget.id) {
      case "mailNumber":
        const checkMailNumberResult = checkNumbers(
          mailNumberInput.current.value
        );
        if (checkMailNumberResult === false) {
          remindMailNumber.current.style.opacity = "1";
          remindMailNumber.current.style.height = "20px";
        } else {
          remindMailNumber.current.style.opacity = "0";
          remindMailNumber.current.style.height = "0px";
        }

        setMailNumber(e.currentTarget.value);
        break;
      case "residentNumber":
        getResidentData(e.currentTarget.value);
        break;
      case "receiver":
        setReceiver(e.currentTarget.value);
        setReceiverIndex(e.currentTarget.options.selectedIndex - 1);
        break;
      case "mailType":
        setMailType(e.currentTarget.value);
        break;
      case "place":
        setPlace(e.currentTarget.value);
        break;
      case "remark":
        setRemark(e.currentTarget.value);
        break;
      default:
        break;
    }
  }

  function initInputDisplay() {
    mailNumberInput.current.style.boxShadow = "none";
    residentNumberInput.current.style.boxShadow = "none";
  }

  function backToDefaultValue() {
    mailNumberInput.current.value = "";
    residentNumberInput.current.value = "";
    remarkInput.current.value = "";
    receiverSelect.current.style.boxShadow = "none";
    setMailNumber("");
    setResidentNumber("");
    setReceiver("");
    setFamilyMembers([]);
    setMailType("普通平信");
    setPlace("信箱");
    updateReceiveDate(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    );
    setRemark("");
  }

  function prepareToUpload() {
    let data;
    const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";
    const checkMailNumberResult = checkNumbers(mailNumberInput.current.value);

    initInputDisplay();

    const index = familyMembers.indexOf(receiver);
    const receiverEmail = familyMembersEmail[index];
    data = {
      mailNumbers: parseInt(mailNumber),
      mailId: nanoid(),
      mailType: mailType,
      place: place,
      receiveDate: receiveDate,
      receiverName: receiver,
      receiverEmail: receiverEmail,
      residentNumbers: residentNumber,
      status: false,
      remark: remark,
    };

    if (checkMailNumberResult === false) {
      setShowAlert(true);
      setAlertMessage("信件編號需為純數字");
      mailNumberInput.current.style.boxShadow = focusBoxShadow;
    } else if (mailNumberInput.current.value === "") {
      setShowAlert(true);
      setAlertMessage("請填寫信件編號");
      mailNumberInput.current.style.boxShadow = focusBoxShadow;
    } else if (residentNumberInput.current.value === "") {
      setShowAlert(true);
      setAlertMessage("請填寫戶號");
      residentNumberInput.current.style.boxShadow = focusBoxShadow;
    } else if (data.receiverName === "") {
      setShowAlert(true);
      setAlertMessage("請選擇收件人");
      receiverSelect.current.style.boxShadow = focusBoxShadow;
    } else {
      uploadMailList(data, data.mailId);
      setSuccessAlert(true);
      setSuccessMessage("資料已成功上傳");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);

      backToDefaultValue();
    }
  }

  useEffect(() => {
    setReceiverEmail(familyMembersEmail[receiverIndex]);
  }, [receiver]);

  return (
    <div className={styles.updateMailList} id="updateMailList">
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={envelope} />
          </div>
          <h3 className={styles.title}>新增信件包裹</h3>
        </div>
      </div>
      <div className={styles.updateForm}>
        <form className={styles.updateMailListForm}>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleMailNumber}`}
          >
            編號
          </label>
          <input
            ref={mailNumberInput}
            id="mailNumber"
            className={`${styles.item} ${styles.item1}`}
            type="text"
            placeholder="請輸入數字編號"
            onChange={updateHook}
            onBlur={hideRemind}
          ></input>
          <div
            ref={remindMailNumber}
            className={`${styles.remindMessage} ${styles.remindMailNumber}`}
          >
            限填數字
          </div>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleResidentNumber}`}
          >
            戶號
          </label>
          <input
            ref={residentNumberInput}
            id="residentNumber"
            className={`${styles.item} ${styles.itemResidentNumber}`}
            type="text"
            placeholder="請輸入已建檔之住戶戶號"
            onChange={updateHook}
            onBlur={hideRemind}
          ></input>
          <div
            ref={remindResidentNumbers}
            className={`${styles.remindMessage} ${styles.remindResidentNumbers}`}
          >
            此戶號不存在
          </div>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleReceiver}`}
          >
            收件人
          </label>
          <select
            ref={receiverSelect}
            id="receiver"
            value={receiver}
            className={`${styles.itemSelect} ${styles.item} ${styles.itemReceiver}`}
            onChange={updateHook}
          >
            <option>請選擇</option>
            {familyMembers.map((member) => {
              return <option key={nanoid()}>{member}</option>;
            })}
          </select>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleMailType}`}
          >
            類型
          </label>
          <select
            id="mailType"
            className={`${styles.itemSelect} ${styles.item} ${styles.itemMailType}`}
            value={mailType}
            onChange={updateHook}
          >
            <option>普通平信</option>
            <option>普通掛號信</option>
            <option>限時掛號信</option>
            <option>小型包裹</option>
            <option>大型包裹</option>
          </select>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleReceiveDate}`}
          >
            寄達日期
          </label>
          <SmallCalendar
            receiveDate={receiveDate}
            updateReceiveDate={updateReceiveDate}
            year={year}
            month={month}
            date={date}
          />
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitlePlace}`}
          >
            位置
          </label>
          <select
            id="place"
            className={`${styles.itemSelect} ${styles.item} ${styles.itemPlace}`}
            value={place}
            onChange={updateHook}
          >
            <option>信箱</option>
            <option>置物櫃</option>
            <option>管理室</option>
          </select>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleRemark}`}
          >
            備註
          </label>
          <input
            ref={remarkInput}
            id="remark"
            className={`${styles.item} ${styles.itemRemark}`}
            type="text"
            placeholder="其他注意事項"
            onChange={updateHook}
          ></input>
        </form>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.informBtn}
            id="informBtn"
            onClick={() => {
              setIsEditingMail(true);
            }}
          >
            通知收件人
            <div className={styles.imgWrapper}>
              <img src={send} />
            </div>
          </button>
          <button
            className={styles.submitBtn}
            id="sendToFirebase"
            onClick={prepareToUpload}
          >
            確認送出
          </button>
          {showAlert && (
            <Alertbox
              category="updateMailbox"
              alertMessage={alertMessage}
              closeAlert={() => {
                setShowAlert(false);
              }}
            />
          )}
        </div>
      </div>
      {isEditingMail && (
        <EmailForm
          receiver={receiver}
          receiverEmail={receiverEmail}
          mailType={mailType}
          place={place}
          closeForm={() => {
            setIsEditingMail(false);
          }}
        />
      )}

      {showSuccessAlert && <AlertSuccessMsg successMessage={successMessage} />}
    </div>
  );
}
