import React, { useEffect, useState } from "react";
import { showDate } from "../../lib";
import styles from "./ResidentList.module.scss";

export default function ResidentList(props) {
  let lists = [];
  let resultList = props.searchResult;
  let updateDate = "";
  console.log(resultList);

  if (resultList.length !== 0) {
    lists = resultList;
  } else {
    lists = props.residentList;
  }

  const MemberList = (list) => {
    let familyMembers = list.familyMembers.map((member) => {
      let index = list.familyMembers.indexOf(member);
      return (
        <div
          className={`${styles.memberInfo}`}
          id={`memberList${index}`}
          key={`memberList${index}`}
        >
          <div className={`${styles.members} ${styles.memberName}`}>
            {member.name}
          </div>
          <div className={`${styles.members} ${styles.memberPhone}`}>
            {member.phone}
          </div>
          <div className={`${styles.members} ${styles.memberEmail}`}>
            {member.email}
          </div>
        </div>
      );
    });
    return familyMembers;
  };

  const List = lists.map((list) => {
    if (list.updateDate) {
      updateDate = showDate(list.updateDate.seconds);
    }

    let index = lists.indexOf(list);
    return (
      <div
        className={styles.residentInfo}
        id={`residentInfo${index}`}
        key={`residentInfo${index}`}
      >
        <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
          戶號
        </div>
        <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
          {list.residentNumbers}
        </div>
        <div className={`${styles.itemTitle} ${styles.titleAddress}`}>地址</div>
        <div className={`${styles.items} ${styles.itemAddress}`}>
          {list.address}
        </div>
        <div className={`${styles.itemTitle} ${styles.titleDate}`}>
          更新日期
        </div>
        <div className={`${styles.items} ${styles.itemDate}`}>{updateDate}</div>
        <div className={`${styles.itemTitle} ${styles.titleMembers}`}>
          住戶成員
        </div>
        <div className={`${styles.itemTitle} ${styles.titleName}`}>姓名</div>
        <div className={`${styles.itemTitle} ${styles.titlePhone}`}>
          聯絡電話
        </div>
        <div className={`${styles.itemTitle} ${styles.titleEmail}`}>Email</div>
        <div className={`${styles.items} ${styles.itemMembers}`}>
          {MemberList(list)}
        </div>
      </div>
    );
  });

  return <div className={styles.residentList}>{List}</div>;
}
