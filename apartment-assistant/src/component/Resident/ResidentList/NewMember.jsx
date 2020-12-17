import React from "react";
import styles from "./ResidentList.module.scss";
import phone from "./../../../img/phone.svg";
import email from "./../../../img/email555.svg";

export default function NewMember(props) {
  const index = parseInt(props.thisMember.id.slice(6));
  // console.log(index);
  return (
    <div className={`${styles.memberInfo}`} id={`${props.thisMember.id}`}>
      <div className={`${styles.members} ${styles.memberName}`}>
        <input
          className={`${styles.editInput}`}
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
          className={`${styles.editInput}`}
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
          className={`${styles.editInput}`}
          id={`editMemberEmail${index}`}
          type="text"
          value={props.familyMembers[index].email}
          onChange={props.changeMemberInfo}
        ></input>
      </div>
    </div>
  );
}
