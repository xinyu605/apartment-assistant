import React, { useState } from "react";
import styles from "./ResidentList.module.scss";
import phone from "./../../../img/phone.svg";
import email from "./../../../img/email555.svg";

export default function Member(props) {
  const familyMembers = props.familyMembers;
  const member = props.member;
  const index = familyMembers.indexOf(member);

  if (props.isEditing === false) {
    return (
      <div className={`${styles.memberInfo}`} id={`memberList${index}`}>
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
  } else {
    return (
      <div className={`${styles.memberInfo}`} id={`memberList${index}`}>
        <div className={`${styles.members} ${styles.memberName}`}>
          <input
            id={`editMemberName${index}`}
            type="text"
            value={props.familyMembers[index].name}
            onChange={props.changeMemberInfo}
          ></input>
        </div>

        <div className={`${styles.members} ${styles.memberPhone}`}>
          <div className={styles.imgWrapper}>
            <img src={phone} />
          </div>
          <input
            id={`editMemberPhone${index}`}
            type="text"
            value={props.familyMembers[index].phone}
            onChange={props.changeMemberInfo}
          ></input>
        </div>

        <div className={`${styles.members} ${styles.memberEmail}`}>
          <div className={styles.imgWrapper}>
            <img src={email} />
          </div>
          <input
            id={`editMemberEmail${index}`}
            type="text"
            value={props.familyMembers[index].email}
            onChange={props.changeMemberInfo}
          ></input>
        </div>
      </div>
    );
  }
}
