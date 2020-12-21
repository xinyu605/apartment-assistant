import React, { useState } from "react";
import styles from "./ResidentList.module.scss";
import phone from "./../../../img/phone.svg";
import email from "./../../../img/email555.svg";
import trashIcon from "./../../../img/trash555.svg";

export default function Member(props) {
  const familyMembers = props.familyMembers;
  const member = props.member;
  const memberId = props.member.memberId;
  const index = props.list.familyMembers.findIndex(
    (element) => element.memberId === memberId
  );
  // const index = props.list.familyMembers.indexOf(member); //original familyMembers
  // console.log(familyMembers);
  console.log(props.member);
  console.log(memberId);

  if (props.isEditing === false) {
    return (
      <div className={`${styles.memberInfo}`} id={`memberList${memberId}`}>
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
    // console.log(index, props.familyMembers[index]);
    if (props.familyMembers[index]) {
      return (
        <div
          className={`${styles.memberInfoEdit}`}
          id={`memberList${memberId}`}
        >
          <div className={`${styles.members} ${styles.memberName}`}>
            <input
              className={`${styles.editInput}`}
              id={`editMemberName${props.member.memberId}`}
              type="text"
              value={props.familyMembers[index].name}
              // onChange={props.changeMemberInfo}
              onChange={(e) => {
                props.changeMemberInfo(e, memberId, index);
              }}
            ></input>
          </div>

          <div className={`${styles.members} ${styles.memberPhone}`}>
            <div className={styles.imgWrapper}>
              <img src={phone} />
            </div>
            <input
              className={`${styles.editInput}`}
              id={`editMemberPhone${props.member.memberId}`}
              type="text"
              value={props.familyMembers[index].phone}
              onChange={(e) => {
                props.changeMemberInfo(e, memberId, index);
              }}
            ></input>
          </div>

          <div className={`${styles.members} ${styles.memberEmail}`}>
            <div className={styles.imgWrapper}>
              <img src={email} />
            </div>
            <input
              className={`${styles.editInput}`}
              id={`editMemberEmail${props.member.memberId}`}
              type="text"
              value={props.familyMembers[index].email}
              onChange={(e) => {
                props.changeMemberInfo(e, memberId, index);
              }}
            ></input>
          </div>
          <div
            className={styles.trashWrapper}
            // id={`deleteMemberBtn${index}`}
            onClick={() => {
              props.deleteMember(member.memberId);
            }}
          >
            <div className={styles.trashImg}>
              <img src={trashIcon} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}
