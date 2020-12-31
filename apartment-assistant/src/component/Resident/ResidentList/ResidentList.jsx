import React from "react";
import ListCard from "./ListCard";
import styles from "./ResidentList.module.scss";
import doorway from "./../../../img/doorway.svg";

export default function ResidentList(props) {
  let lists = [];
  let resultList = props.searchResult;

  if (resultList.length !== 0) {
    lists = resultList;
  } else {
    lists = props.residentList;
  }

  if (lists.length === 0) {
    return (
      <div className={styles.emptyResidentList}>
        <div className={styles.imgWrapper}>
          <img src={doorway} />
        </div>
        <div className={styles.emptyText}>查無住戶資訊</div>
        <div className={styles.circles}>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
          <span className={styles.circle}></span>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.residentList}>
        {lists.map((list) => {
          return (
            <ListCard
              list={list}
              lists={lists}
              deleteResident={props.deleteResident}
              key={`residentCard${list.residentId}`}
            />
          );
        })}
      </div>
    );
  }
}
