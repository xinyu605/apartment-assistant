import React, { useEffect, useRef, useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import AlertboxForMailbox from "./../Common/AlertboxForMailbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import { EmailForm } from "./EmailForm";
import styles from "./UpdateMailList.module.scss";
import { uploadMailList, getTimeStamp } from "./../../firebase";
import { nanoid } from "nanoid";
import envelope from "./../../img/envelope.svg";
import send from "./../../img/send.svg";
import { checkNumbers } from "../../lib";

export function UpdateMailList(props) {
  const [mailNumber, setMailNumber] = useState("");
  const [residentNumber, setResidentNumber] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [mailType, setMailType] = useState("普通平信");
  const [receiveDate, setReceiveDate] = useState(0);
  const [place, setPlace] = useState("信箱");
  const [status, setStatus] = useState(false);
  const [remark, setRemark] = useState("無");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersEmail, setFamilyMembersEmail] = useState([]);
  const [isEditingMail, setIsEditingMail] = useState(false);
  //
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState(new Date().getDate());

  //alert dialog
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //ref
  const remindResidentNumbers = useRef(null);
  const mailNumberInput = useRef(null);
  const residentNumberInput = useRef(null);
  const receiverSelect = useRef(null);
  const statusSelect = useRef(null);

  function updateReceiveDate(year, month, date) {
    // console.log(year, month, date);
    const seconds = getTimeStamp(year, month, date);
    // console.log(seconds);
    setReceiveDate(seconds);
    setYear(year);
    setMonth(month);
    setDate(date);
  }

  const ReceiverOptions = familyMembers.map((member) => {
    return <option key={nanoid()}>{member}</option>;
  });

  async function getResidentData(residentNumber) {
    setResidentNumber(residentNumber);
    setFamilyMembers([]);
    setFamilyMembersEmail([]);
    const residentList = props.residentList;
    console.log(residentList);
    let familyMembersName = [];
    let familyMembersEmail = [];
    let residentNumberExist = false;
    for (let i = 0; i < residentList.length; i++) {
      if (residentList[i].residentNumbers === residentNumber) {
        // console.log(residentList[i]);
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

  function hideRemind() {
    if (residentNumber === "") {
      remindResidentNumbers.current.style.opacity = "0";
      remindResidentNumbers.current.style.height = "0px";
    }
  }

  function updateHook(e) {
    // console.log(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "mailNumber":
        setMailNumber(e.currentTarget.value);
        break;
      case "residentNumber":
        getResidentData(e.currentTarget.value);
        break;
      case "receiver":
        setReceiver(e.currentTarget.value);
        break;
      case "mailType":
        setMailType(e.currentTarget.value);
        break;
      case "place":
        setPlace(e.currentTarget.value);
        break;
      case "status":
        if (e.currentTarget.value === "已領取") {
          setStatus(true);
        }
        break;
      case "remark":
        setRemark(e.currentTarget.value);
        break;
      default:
        break;
    }
  }

  function prepareToUpload() {
    let data;
    // let message = false;
    const focusBorder = "2px solid #f26157";
    const inputs = document.querySelectorAll("input");
    const checkMailNumberResult = checkNumbers(mailNumberInput.current.value);

    // init inputs style before checking format
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].style.border = "1px solid #96bbbb";
    }

    const index = familyMembers.indexOf(receiver);
    const receiverEmail = familyMembersEmail[index];
    console.log(receiverEmail);
    data = {
      mailNumbers: parseInt(mailNumber),
      mailId: nanoid(),
      mailType: mailType,
      place: place,
      receiveDate: receiveDate,
      receiverName: receiver,
      receiverEmail: receiverEmail,
      residentNumbers: residentNumber,
      status: status,
      remark: remark,
    };
    console.log(data);

    /********************* 
      Check inputs format
    **********************/

    if (checkMailNumberResult === false) {
      setShowAlert(true);
      setAlertMessage("信件編號需為純數字");
      mailNumberInput.current.style.border = focusBorder;
    } else if (mailNumberInput.current.value === "") {
      setShowAlert(true);
      setAlertMessage("請填寫信件編號(純數字)");
      mailNumberInput.current.style.border = focusBorder;
    } else if (residentNumberInput.current.value === "") {
      setShowAlert(true);
      setAlertMessage("請填寫戶號");
      residentNumberInput.current.style.border = focusBorder;
    } else if (data.receiverName === "") {
      setShowAlert(true);
      setAlertMessage("請選擇收件人");
      receiverSelect.current.style.border = focusBorder;
    } else {
      uploadMailList(data, data.mailId);
      setSuccessAlert(true);
      setSuccessMessage("資料已成功上傳");
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);

      // back to initial condition
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
      }
      receiverSelect.current.value = "";
      receiverSelect.current.style.border = "1px solid #96bbbb";
      statusSelect.current.value = "未領取";
      setMailNumber("");
      setResidentNumber("");
      setReceiver("");
      setFamilyMembers([]);
      setMailType("普通平信");
      setPlace("信箱");
      setStatus(false);
      updateReceiveDate(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      );
    }
  }

  function toggleEmailForm(e) {
    e.preventDefault();
    isEditingMail === true ? setIsEditingMail(false) : setIsEditingMail(true);
  }

  function closeForm() {
    setIsEditingMail(false);
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "closeAlertBtn":
        setShowAlert(false);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    // console.log(receiver, familyMembers, familyMembersEmail);
    const index = familyMembers.indexOf(receiver);
    // console.log(familyMembersEmail[index]);
    setReceiverEmail(familyMembersEmail[index]);
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
            placeholder="請輸入編號"
            onChange={updateHook}
          ></input>
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
            {ReceiverOptions}
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
            className={`${styles.updateMailLabel} ${styles.itemTitleStatus}`}
          >
            狀態
          </label>
          <select
            ref={statusSelect}
            id="status"
            className={`${styles.itemSelect} ${styles.item} ${styles.itemStatus}`}
            onChange={updateHook}
          >
            <option>未領取</option>
            <option>已領取</option>
          </select>
          <label
            className={`${styles.updateMailLabel} ${styles.itemTitleRemark}`}
          >
            備註
          </label>
          <input
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
            onClick={toggleEmailForm}
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
          <AlertboxForMailbox
            alertMessage={alertMessage}
            showAlert={showAlert}
            closeAlert={closeAlert}
          />
        </div>
      </div>

      <EmailForm
        receiver={receiver}
        receiverEmail={receiverEmail}
        mailType={mailType}
        place={place}
        isEditingMail={isEditingMail}
        toggleEmailForm={toggleEmailForm}
        closeForm={closeForm}
      />
      <AlertSuccessMsg
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
        closeAlert={closeAlert}
      />
    </div>
  );
}
