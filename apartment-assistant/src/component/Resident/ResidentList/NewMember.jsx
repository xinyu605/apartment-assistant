import React, { useRef } from "react";
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

  return (
    <div className={`${styles.memberInfoEdit}`} id={`${props.thisMember.id}`}>
      <div className={`${styles.members} ${styles.memberName}`}>
        <input
          ref={nameInput}
          className={`${styles.editInput}`}
          id={`editMemberName${memberId}`}
          type="text"
          value={props.familyMembers[index].name}
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
          id={`editMemberPhone${memberId}`}
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
          ref={emailInput}
          className={`${styles.editInput}`}
          id={`editMemberEmail${memberId}`}
          type="text"
          value={props.familyMembers[index].email}
          onChange={(e) => {
            props.changeMemberInfo(e, memberId, index);
          }}
        ></input>
      </div>
      <div
        className={styles.trashWrapper}
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
