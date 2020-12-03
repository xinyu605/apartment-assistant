import React, { useState } from "react";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import { SmallCalendar } from "./SmallCalendar";
import styles from "./UpdateMailList.module.scss";
import { uploadMailList, getTimeStamp, getReceiverInfo } from "./../firebase";
import { nanoid } from "nanoid";
import envelope from "./../img/envelope.svg";

export function UpdateMailList() {
  const [mailNumber, setMailNumber] = useState("");
  const [mailId, setMailId] = useState("");
  const [residentNumber, setResidentNumber] = useState("");
  const [receiver, setReceiver] = useState("");
  const [mailType, setMailType] = useState("普通平信");
  const [receiveDate, setReceiveDate] = useState(0);
  const [place, setPlace] = useState("信箱");
  const [status, setStatus] = useState(false);
  const [remark, setRemark] = useState("無");
  let history = useHistory();

  function updateReceiveDate(year, month, date) {
    // console.log(year, month, date);
    const seconds = getTimeStamp(year, month, date);
    // console.log(seconds);
    setReceiveDate(seconds);
  }

  function updateHook(e) {
    // console.log(e.currentTarget.id);
    switch (e.currentTarget.id) {
      case "mailNumber":
        setMailNumber(e.currentTarget.value);
        break;
      case "residentNumber":
        setResidentNumber(e.currentTarget.value);
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
        data = {
          mailNumbers: parseInt(mailNumber),
          mailId: nanoid(),
          mailType: mailType,
          place: place,
          receiveDate: receiveDate,
          receiver: { name: receiver, residentNumbers: residentNumber },
          familyMembers: "",
          status: status,
          taker: { name: "", takeDate: "" },
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
      getReceiverInfo(residentNumber, data.mailId);
      // window.location.href = "/mailbox/untaken";
      history.push("/admin/mailbox"); //無法順利跳轉
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
          <input
            id="receiver"
            className={styles.item}
            type="text"
            placeholder="請輸入收件人姓名"
            onChange={updateHook}
          ></input>
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
