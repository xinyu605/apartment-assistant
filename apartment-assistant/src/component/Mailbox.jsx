import React, { useEffect, useState } from "react";
import styles from "./Mailbox.module.scss";
// import PropTypes from "prop-types";
import { getMailList } from "./../firebase";
import { showDate } from "./../lib";

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
          <div className="status">{changeStatus}</div>
        </div>
      </div>
    </div>
  );
}

function Mailbox() {
  const [data, setData] = useState({});
  // useEffect will run only after an initial render, and after an update on data is occurred
  useEffect(() => {
    getMailList(false).then((mailList) => {
      setData(mailList);
    });
  }, []);

  return (
    <div>
      <h2>信件包裹紀錄</h2>
      <UntakenMailList list={data} />
    </div>
  );
}

// Mailbox.prototypes = {};
export default Mailbox;
