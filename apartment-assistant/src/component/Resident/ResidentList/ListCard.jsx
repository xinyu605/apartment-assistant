import React, { useState } from "react";
import Member from "./Member";
import NewMember from "./NewMember";
import AlertDownward from "./../../Common/AlertDownward";
import AlertSuccessMsg from "./../../Common/AlertSuccessMsg";
import styles from "./ResidentList.module.scss";
import editIcon from "./../../../img/edit.svg";
import trashIcon from "./../../../img/trash.svg";
import address from "./../../../img/address.svg";
import check from "./../../../img/check.svg";
import close from "./../../../img/close.svg";
import plus from "./../../../img/plus.svg";
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
  const [familyMembersForm, setFamilyMembersForm] = useState([]);

  // alert dialogs
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  let index = lists.indexOf(list);
  let updateDate = "";

  // console.log(list);

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
    setFamilyMembersForm([]);
    setEditing(false);
  }

  function createMemberInput(e) {
    e.preventDefault();
    // console.log(familyMembers.length);
    let currentFamilyMembersForm = familyMembersForm.map((memberForm) => ({
      ...memberForm,
    }));
    currentFamilyMembersForm.push({ id: `member${familyMembers.length}` });
    setFamilyMembersForm(currentFamilyMembersForm);
    let newFamilyMembers = familyMembers.map((member) => ({ ...member }));
    newFamilyMembers.push({ name: "", phone: "", email: "" });
    setFamilyMembers(newFamilyMembers);
  }

  function deleteMember(e) {
    const target = e.currentTarget;
    const removeIndex = parseInt(target.id.slice(15));
    let newFamilyMembers = familyMembers.map((member) => ({ ...member }));
    newFamilyMembers.splice(removeIndex, 1);
    console.log(newFamilyMembers);
    setFamilyMembers(newFamilyMembers);
    let newFamilyMembersForm = familyMembersForm.map((memberForm) => ({
      ...memberForm,
    }));
    if (familyMembersForm.length !== 0) {
      newFamilyMembersForm.pop();
      setFamilyMembersForm(newFamilyMembersForm);
    }
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

    if (familyMembers.length < 1) {
      setAlertDownward(true);
      setAlertDownwardMessage("住戶成員不能少於一位");
      // window.alert("住戶成員不能少於一位！");
    } else {
      editUpdateResident(infoPackage);
      // window.alert("成功更新！");
      setSuccessAlert(true);
      setSuccessMessage("住戶資訊更新成功");
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);
      window.setTimeout(() => {
        setEditing(false);
      }, 2001);
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "closeAlertBtn":
        setAlertDownward(false);
        break;
      default:
        break;
    }
  }

  if (isEditing === false) {
    return (
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
        <div className={`${styles.items} ${styles.itemDate}`}>{updateDate}</div>
        <div className={`${styles.items} ${styles.itemMembers}`}>
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
    );
  } else {
    return (
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
        <div
          className={styles.plusImg}
          id={`plus${index}`}
          onClick={createMemberInput}
        >
          <img src={plus} />
        </div>

        <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
          戶號
        </div>
        <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
          <input
            className={styles.editInput}
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
            className={styles.editInput}
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
                familyMembersForm={familyMembersForm}
                changeMemberInfo={changeMemberInfo}
                deleteMember={deleteMember}
                key={`member${index}`}
              />
            );
          })}
          {familyMembersForm.map((item) => {
            return (
              <NewMember
                familyMembers={familyMembers}
                familyMembersForm={familyMembersForm}
                thisMember={item}
                changeMemberInfo={changeMemberInfo}
                deleteMember={deleteMember}
                key={item.id}
              />
            );
          })}
        </div>
        <AlertDownward
          showAlertDownward={showAlertDownward}
          alertDownwardMessage={alertDownwardMessage}
          closeAlert={closeAlert}
        />
        <AlertSuccessMsg
          showSuccessAlert={showSuccessAlert}
          successMessage={successMessage}
        />
      </div>
    );
  }
}
