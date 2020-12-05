import React, { useState } from "react";
import { SmallCalendar } from "./SmallCalendar";
import styles from "./UpdateMailList.module.scss";
import {
  uploadMailList,
  getTimeStamp,
  getReceiverInfo,
} from "./../../firebase";
import { nanoid } from "nanoid";
import envelope from "./../../img/envelope.svg";

export function UpdateMailList(props) {
  const [mailNumber, setMailNumber] = useState("");
  const [residentNumber, setResidentNumber] = useState("");
  const [receiver, setReceiver] = useState("");
  // const [receiverEmail, setReceiverEmail] = useState("");
  const [mailType, setMailType] = useState("普通平信");
  const [receiveDate, setReceiveDate] = useState(0);
  const [place, setPlace] = useState("信箱");
  const [status, setStatus] = useState(false);
  const [remark, setRemark] = useState("無");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [familyMembersEmail, setFamilyMembersEmail] = useState([]);

  function updateReceiveDate(year, month, date) {
    // console.log(year, month, date);
    const seconds = getTimeStamp(year, month, date);
    // console.log(seconds);
    setReceiveDate(seconds);
  }

  const ReceiverOptions = familyMembers.map((member) => {
    return <option key={nanoid()}>{member}</option>;
  });

  async function getResidentData(residentNumber) {
    setResidentNumber(residentNumber);
    setFamilyMembers([]);
    setFamilyMembersEmail([]);
    const residentList = props.residentList;
    let familyMembersName = [];
    let familyMembersEmail = [];
    for (let i = 0; i < residentList.length; i++) {
      if (residentList[i].residentNumbers === residentNumber) {
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
    let message = false;
    const inputs = document.querySelectorAll("input");
    for (let i = 0; i < inputs.length - 1; i++) {
      inputs[i].classList.remove(styles.focus);
      if (inputs[i].value === "") {
        inputs[i].classList.add(styles.focus);
        message = true;
      } else {
        const index = familyMembers.indexOf(receiver);
        const receiverEmail = familyMembersEmail[index];
        // setReceiverEmail(familyMembersEmail[index]);
        data = {
          mailNumbers: parseInt(mailNumber),
          mailId: nanoid(),
          mailType: mailType,
          place: place,
          receiveDate: receiveDate,
          receiverName: receiver,
          receiverEmail: receiverEmail,
          residentNumbers: residentNumber,
          // receiver: { name: receiver, residentNumbers: residentNumber }, //待刪
          // familyMembers: "",
          status: status,
          takerName: "",
          takeDate: "",
          // taker: { name: "", takeDate: "" }, //待刪
          remark: remark,
        };
        // console.log(data);
      }
    }
    if (message) {
      alert("請確實填寫資料");
      message = false;
    } else {
      uploadMailList(data, data.mailId);
      for (let i = 0; i < inputs.length - 1; i++) {
        inputs[i].value = "";
      }
    }
  }

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
        <form>
          <label className={styles.itemTitle1}>編號</label>
          <input
            id="mailNumber"
            className={styles.item}
            type="text"
            placeholder="請輸入編號"
            onChange={updateHook}
          ></input>
          <label className={styles.itemTitle2}>戶號</label>
          <input
            id="residentNumber"
            className={styles.item}
            type="text"
            placeholder="請輸入戶號"
            onChange={updateHook}
          ></input>
          <label className={styles.itemTitle3}>收件人</label>
          <select id="receiver" className={styles.item} onChange={updateHook}>
            <option>請選擇</option>
            {ReceiverOptions}
          </select>
          <label className={styles.itemTitle1}>類型</label>
          <select id="mailType" className={styles.item} onChange={updateHook}>
            <option>普通平信</option>
            <option>普通掛號信</option>
            <option>限時掛號信</option>
            <option>小型包裹</option>
            <option>大型包裹</option>
          </select>
          <label className={styles.itemTitle2}>寄達日期</label>
          <SmallCalendar updateReceiveDate={updateReceiveDate} />
          <label className={styles.itemTitle3}>位置</label>
          <select id="place" className={styles.item} onChange={updateHook}>
            <option>信箱</option>
            <option>置物櫃</option>
            <option>管理室</option>
          </select>
          <label className={styles.itemTitle1}>狀態</label>
          <select id="status" className={styles.item} onChange={updateHook}>
            <option>未領取</option>
            <option>已領取</option>
          </select>
          <label className={styles.itemTitle2}>備註</label>
          <input
            id="remark"
            className={styles.item}
            type="text"
            placeholder="其他注意事項"
            onChange={updateHook}
          ></input>
        </form>
        <button
          className={styles.submitBtn}
          id="sendToFirebase"
          onClick={prepareToUpload}
        >
          確認送出
        </button>
      </div>
    </div>
  );
}