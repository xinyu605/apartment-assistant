import React, { useEffect, useState } from "react";
import { showDate } from "../../lib";
import styles from "./ResidentList.module.scss";

export default function ResidentList(props) {
  let lists = props.residentList;
  let updateDate = "";
  console.log(lists);

  const MemberList = (list) => {
    let familyMembers = list.familyMembers.map((member) => {
      let index = list.familyMembers.indexOf(member);
      return (
        <div
          className={styles.memberList}
          id={`memberList${index}`}
          key={`memberList${index}`}
        >
          <div className={`${styles.items} ${styles.item2}`}>
            <div className={styles.itemTitle}>姓名</div>
            <div>{member.name}</div>
          </div>
          <div className={`${styles.items} ${styles.item3}`}>
            <div className={styles.itemTitle}>聯絡電話</div>
            <div>{member.phone}</div>
          </div>
          <div className={`${styles.items} ${styles.item4}`}>
            <div className={styles.itemTitle}>Email</div>
            <div>{member.email}</div>
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
        <div className={`${styles.items} ${styles.item1}`}>
          <div className={styles.itemTitle}>戶號</div>
          <div>{list.residentNumbers}</div>
        </div>
        <div className={`${styles.items} ${styles.item5}`}>
          <div className={styles.itemTitle}>地址</div>
          <div>{list.address}</div>
        </div>
        <div className={`${styles.items} ${styles.item6}`}>
          <div className={styles.itemTitle}>更新日期</div>
          <div>{updateDate}</div>
        </div>
        {MemberList(list)}
      </div>
    );
  });

  return <div className={styles.residentList}>{List}</div>;
}
