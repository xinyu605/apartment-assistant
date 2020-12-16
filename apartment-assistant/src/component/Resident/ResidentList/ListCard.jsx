import React, { useState } from "react";
import Member from "./Member";
import styles from "./ResidentList.module.scss";
import editIcon from "./../../../img/edit.svg";
import trashIcon from "./../../../img/trash.svg";
import address from "./../../../img/address.svg";
import check from "./../../../img/check.svg";
import close from "./../../../img/close.svg";
import { getTimeStamp, editUpdateResident } from "./../../../firebase";
import { showDate } from "./../../../lib";

export default function ListCard(props) {
  const lists = props.lists;
  const list = props.list;
  const [isEditing, setEditing] = useState(false);
  const [residentId, setResidentId] = useState(list.residentId);
  const [floor, setFloor] = useState(props.list.floor);
  const [residentNumbers, setResidentNumbers] = useState(list.residentNumbers);
  const [residentAddress, setResidentAddress] = useState(list.address);
  const [updateDateWhenEdit, setUpdateDateWhenEdit] = useState(list.updateDate);
  const [showDateWhenEditing, setDateWhenEditing] = useState("");
  const [familyMembers, setFamilyMembers] = useState(list.familyMembers);

  let index = lists.indexOf(list);
  let updateDate = "";

  console.log(list);

  if (list.updateDate) {
    updateDate = showDate(list.updateDate.seconds);
  }

  function editResident(e) {
    setEditing(true);

    //get updateDate as turn on editing mode
    const editYear = new Date().getFullYear();
    const editMonth = new Date().getMonth() + 1;
    const editDate = new Date().getDate();
    const secondsToFirebase = getTimeStamp(editYear, editMonth, editDate);
    setUpdateDateWhenEdit(secondsToFirebase);
    setDateWhenEditing(showDate(new Date().getTime() / 1000));
  }

  function changeInput(e) {
    const target = e.currentTarget;
    switch (target.id) {
      case `editResidentNumbers${index}`:
        setResidentNumbers(target.value);
        setFloor(target.value.slice(0, 1));
        break;
      case `editResidentAddress${index}`:
        setResidentAddress(target.value);
        break;
      default:
        break;
    }
  }

  function changeMemberInfo(e) {
    const target = e.currentTarget;
    console.log(familyMembers);
    // let newFamilyMembers = [...familyMembers];  //只複製第一層，沒有複製內部的物件，後續處理內部物件會指向原來的陣列
    let newFamilyMembers = familyMembers.map((member) => ({ ...member })); //完全複製，後續處理內部物件會指向新的陣列
    console.log(newFamilyMembers);

    if (target.id.startsWith("editMemberName")) {
      const index = parseInt(e.currentTarget.id.slice(14));
      newFamilyMembers[index].name = e.currentTarget.value;
    } else if (target.id.startsWith("editMemberPhone")) {
      const index = parseInt(target.id.slice(15));
      newFamilyMembers[index].phone = target.value;
    } else if (target.id.startsWith("editMemberEmail")) {
      const index = parseInt(target.id.slice(15));
      newFamilyMembers[index].email = target.value;
    }

    setFamilyMembers(newFamilyMembers);
  }

  function cancelEditing() {
    console.log(props.list);
    setResidentNumbers(props.list.residentNumbers);
    setResidentAddress(props.list.address);
    setUpdateDateWhenEdit(props.list.updateDate);
    setFamilyMembers(props.list.familyMembers);
    setEditing(false);
  }

  function packNewResidentInfo() {
    const infoPackage = {
      residentId: residentId,
      residentNumbers: residentNumbers,
      floor: floor,
      address: residentAddress,
      // remark:""
      familyMembers: familyMembers,
      updateDate: updateDateWhenEdit,
    };
    editUpdateResident(infoPackage);
    window.alert("成功更新！");
    setEditing(false);
  }

  if (isEditing === false) {
    return (
      <div>
        <div className={styles.residentInfo} id={`residentInfo${index}`}>
          <div
            className={styles.trashImg}
            id={`trash${index}`}
            onClick={props.deleteResident}
          >
            <img src={trashIcon} />
          </div>
          <div
            className={styles.editImg}
            id={`edit${index}`}
            // onClick={props.editResident}
            onClick={editResident}
          >
            <img src={editIcon} />
          </div>
          <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
            戶號
          </div>
          <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
            {props.list.residentNumbers}
          </div>
          <div className={`${styles.items} ${styles.itemAddress}`}>
            <div className={styles.imgWrapper}>
              <img src={address} />
            </div>
            {props.list.address}
          </div>
          <div className={`${styles.itemTitle} ${styles.titleDate}`}>
            更新日期
          </div>
          <div className={`${styles.items} ${styles.itemDate}`}>
            {updateDate}
          </div>
          <div className={`${styles.items} ${styles.itemMembers}`}>
            {/* <MemberList list={list} isEditing={isEditing} /> */}
            {props.list.familyMembers.map((member) => {
              const index = list.familyMembers.indexOf(member);
              return (
                <Member
                  isEditing={isEditing}
                  list={list}
                  member={member}
                  familyMembers={props.list.familyMembers}
                  key={`member${index}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className={styles.residentInfo} id={`residentInfo${index}`}>
          <div
            className={styles.doneImg}
            id={`done${index}`}
            onClick={packNewResidentInfo}
          >
            <img src={check} />
          </div>
          <div
            className={styles.closeImg}
            id={`close${index}`}
            onClick={cancelEditing}
          >
            <img src={close} />
          </div>

          <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
            戶號
          </div>
          <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
            <input
              id={`editResidentNumbers${index}`}
              type="text"
              value={residentNumbers}
              onChange={changeInput}
            ></input>
          </div>
          <div className={`${styles.items} ${styles.itemAddress}`}>
            <div className={styles.imgWrapper}>
              <img src={address} />
            </div>
            <input
              id={`editResidentAddress${index}`}
              type="text"
              value={residentAddress}
              onChange={changeInput}
            ></input>
          </div>
          <div className={`${styles.itemTitle} ${styles.titleDate}`}>
            更新日期
          </div>
          <div className={`${styles.items} ${styles.itemDate}`}>
            {showDateWhenEditing}
          </div>
          <div className={`${styles.items} ${styles.itemMembers}`}>
            {/* <MemberList list={list} isEditing={isEditing} /> */}
            {list.familyMembers.map((member) => {
              const index = list.familyMembers.indexOf(member);
              return (
                <Member
                  isEditing={isEditing}
                  list={list}
                  member={member}
                  familyMembers={familyMembers}
                  changeMemberInfo={changeMemberInfo}
                  key={`member${index}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
