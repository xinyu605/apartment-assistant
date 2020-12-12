import React, { useEffect, useState } from "react";
import { showDate } from "../../lib";
import styles from "./ResidentList.module.scss";
import editIcon from "./../../img/edit.svg";
import trashIcon from "./../../img/trash.svg";
import address from "./../../img/address.svg";
import phone from "./../../img/phone.svg";
import email from "./../../img/email555.svg";

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
            <div className={styles.imgWrapper}>
              <img src={phone} />
            </div>

            {member.phone}
          </div>
          <div className={`${styles.members} ${styles.memberEmail}`}>
            <div className={styles.imgWrapper}>
              <img src={email} />
            </div>

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
      <div key={`residentCard${index}`}>
        <div className={styles.residentInfo} id={`residentInfo${index}`}>
          <div
            className={styles.trashImg}
            id={`trash${index}`}
            onClick={props.deleteResident}
          >
            <img src={trashIcon} />
          </div>
          <div className={styles.editImg} id={`edit${index}`}>
            <img src={editIcon} />
          </div>
          <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
            戶號
          </div>
          <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
            {list.residentNumbers}
          </div>
          <div className={`${styles.items} ${styles.itemAddress}`}>
            <div className={styles.imgWrapper}>
              <img src={address} />
            </div>
            {list.address}
          </div>
          <div className={`${styles.itemTitle} ${styles.titleDate}`}>
            更新日期
          </div>
          <div className={`${styles.items} ${styles.itemDate}`}>
            {updateDate}
          </div>
          <div className={`${styles.items} ${styles.itemMembers}`}>
            {MemberList(list)}
          </div>
        </div>
      </div>
    );
  });

  return <div className={styles.residentList}>{List}</div>;
}
