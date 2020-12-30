import React from "react";
import styles from "./ResidentList.module.scss";
import phone from "./../../../img/phone.svg";
import email from "./../../../img/email555.svg";
import trashIcon from "./../../../img/trash555.svg";

export default function Member(props) {
  const index = props.familyMembers.findIndex(
    (element) => element.memberId === props.member.memberId
  );
  const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";

  if (props.isEditing === false) {
    return (
      <div
        className={`${styles.memberInfo}`}
        id={`memberList${props.member.memberId}`}
      >
        <div className={`${styles.members} ${styles.memberName}`}>
          {props.member.name}
        </div>
        <div className={`${styles.members} ${styles.memberPhone}`}>
          <div className={styles.imgWrapper}>
            <img src={phone} />
          </div>
          {props.member.phone}
        </div>
        <div className={`${styles.members} ${styles.memberEmail}`}>
          <div className={styles.imgWrapper}>
            <img src={email} />
          </div>
          {props.member.email}
        </div>
      </div>
    );
  } else {
    if (props.familyMembers[index]) {
      return (
        <div
          className={`${styles.memberInfoEdit}`}
          id={`memberList${props.member.memberId}`}
        >
          <div className={`${styles.members} ${styles.memberName}`}>
            <input
              className={`${styles.editInput}`}
              id={`editMemberName${props.member.memberId}`}
              type="text"
              style={
                props.fillInMemberName[index]
                  ? { boxShadow: "none" }
                  : { boxShadow: focusBoxShadow }
              }
              value={props.familyMembers[index].name}
              onChange={(e) => {
                props.changeMemberInfo(e, props.member.memberId, index);
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
              style={
                props.fillInMemberPhone[index]
                  ? { boxShadow: "none" }
                  : { boxShadow: focusBoxShadow }
              }
              value={props.familyMembers[index].phone}
              onChange={(e) => {
                props.changeMemberInfo(e, props.member.memberId, index);
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
              style={
                props.fillInMemberEmail[index]
                  ? { boxShadow: "none" }
                  : { boxShadow: focusBoxShadow }
              }
              value={props.familyMembers[index].email}
              onChange={(e) => {
                props.changeMemberInfo(e, props.member.memberId, index);
              }}
            ></input>
          </div>
          <div
            className={styles.trashWrapper}
            onClick={() => {
              props.deleteMember(props.member.memberId);
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
