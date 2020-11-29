import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams, //nested router
  useRouteMatch,
} from "react-router-dom";
import styles from "./UntakenMailList.module.scss";
import { showDate, scrollToTarget } from "../../lib";
import inboxUntaken from "./../img/inboxUntaken.svg";

export function UntakenMailList(props) {
  let { path, url } = useRouteMatch();
  // console.log("path:", path, "url:", url);
  // console.log(props);
  let lists = props.list;
  let receiveDate = "";

  const List = lists.map((list) => {
    if (list.receiveDate) {
      receiveDate = showDate(list.receiveDate.seconds);
    }
    return (
      <div className={styles.list} key={`mail${list.mailNumbers}`}>
        <div className="mailNumbers">{list.mailNumbers}</div>
        <div className="residentNumber">
          {list.receiver ? list.receiver.residentNumbers : ""}
        </div>
        {list.receiver ? list.receiver.name : ""}
        <div className="mailType">{list.mailType}</div>
        <div className="receiveDate">{receiveDate}</div>
        <div className="place">{list.place}</div>
        <div className="remark">{list.remark}</div>
        <button className="status">領取</button>
      </div>
    );
  });

  return (
    <Router>
      <Route path={`${url}`}>
        <div className={styles.untakenMailList}>
          {/* list header */}
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              <div className={styles.titleImg}>
                <img src={inboxUntaken} />
              </div>
              <h3 className={styles.title}>信件包裹列表</h3>
            </div>

            <div className={styles.buttonBox}>
              <div
                className={`${styles.buttonBackground} ${styles.left}`}
              ></div>
              <div className={styles.button}>
                <Link to={`${url}/untaken`} className={styles.current}>
                  未領取
                </Link>
              </div>
              <div className={styles.button}>
                <Link to={`taken`}>已領取</Link>
              </div>
            </div>
            <button
              onClick={() => {
                scrollToTarget("updateMailList");
              }}
            >
              新增
            </button>
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
            {List}
          </div>
        </div>
      </Route>
    </Router>
  );
}
