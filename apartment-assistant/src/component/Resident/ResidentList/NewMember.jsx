import React, { useEffect, useRef } from "react";
import styles from "./ResidentList.module.scss";
import phone from "./../../../img/phone.svg";
import email from "./../../../img/email555.svg";
import trashIcon from "./../../../img/trash555.svg";

export default function NewMember(props) {
  const memberId = props.thisMember.id.slice(10);
  const nameInput = useRef(null);
  const phoneInput = useRef(null);
  const emailInput = useRef(null);
  const index = props.familyMembers.findIndex(
    (element) => element.memberId === memberId
  );
  // console.log(index, props.familyMembers[index]);
  console.log(props.thisMember);

  return (
    <div className={`${styles.memberInfoEdit}`} id={`${props.thisMember.id}`}>
      <div className={`${styles.members} ${styles.memberName}`}>
        <input
          ref={nameInput}
          className={`${styles.editInput}`}
          // id={`editMemberName${index}`}
          id={`editMemberName${memberId}`}
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
          ref={phoneInput}
          className={`${styles.editInput}`}
          // id={`editMemberPhone${index}`}
          id={`editMemberPhone${memberId}`}
          type="text"
          value={props.familyMembers[index].phone}
          // onChange={props.changeMemberInfo}
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
          ref={emailInput}
          className={`${styles.editInput}`}
          // id={`editMemberEmail${index}`}
          id={`editMemberEmail${memberId}`}
          type="text"
          value={props.familyMembers[index].email}
          // onChange={props.changeMemberInfo}
          onChange={(e) => {
            props.changeMemberInfo(e, memberId, index);
          }}
        ></input>
      </div>
      <div
        className={styles.trashWrapper}
        // id={`deleteMemberBtn${index}`}
        // onClick={props.deleteMember}
        onClick={() => {
          props.deleteMember(memberId);
        }}
      >
        <div className={styles.trashImg}>
          <img src={trashIcon} />
        </div>
      </div>
    </div>
  );
}
