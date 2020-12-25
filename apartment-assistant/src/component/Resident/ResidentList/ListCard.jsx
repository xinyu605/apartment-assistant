import React, { useState, useRef } from "react";
import Member from "./Member";
import NewMember from "./NewMember";
import AlertDownward from "./../../Common/AlertDownward";
import AlertSuccessMsg from "./../../Common/AlertSuccessMsg";
import styles from "./ResidentList.module.scss";
import editIcon from "./../../../img/edit555.svg";
import trashIcon from "./../../../img/trash555.svg";
import address from "./../../../img/address.svg";
import check from "./../../../img/check.svg";
import close from "./../../../img/close.svg";
import plus from "./../../../img/plus555.svg";
import remark from "./../../../img/remark.svg";
import { getTimeStamp, editUpdateResident } from "./../../../firebase";
import { nanoid } from "nanoid";
import {
  checkEmailFormat,
  checkUserName,
  checkUserPhone,
  showDate,
} from "./../../../lib";
import { element } from "prop-types";

export default function ListCard(props) {
  const lists = props.lists;
  const list = props.list;
  const [isEditing, setEditing] = useState(false);
  const [residentId, setResidentId] = useState(list.residentId);
  const [floor, setFloor] = useState(props.list.floor);
  const [residentNumbers, setResidentNumbers] = useState(list.residentNumbers);
  const [residentAddress, setResidentAddress] = useState(list.address);
  const [residentRemark, setResidentRemark] = useState(list.remark);
  const [updateDateWhenEdit, setUpdateDateWhenEdit] = useState(list.updateDate);
  const [showDateWhenEditing, setDateWhenEditing] = useState("");
  const [familyMembers, setFamilyMembers] = useState(list.familyMembers);
  const [familyMembersForm, setFamilyMembersForm] = useState([]);

  // alert dialogs
  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //ref
  const trashIconImg = useRef(null);
  const editResidentNumbers = useRef(null);
  const editResidentAddress = useRef(null);
  const editResidentRemark = useRef(null);

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
      case `editResidentRemark${index}`:
        setResidentRemark(target.value);
        break;
      default:
        break;
    }
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
    const newMemberId = nanoid(20);
    let currentFamilyMembersForm = familyMembersForm.map((memberForm) => ({
      ...memberForm,
    }));
    currentFamilyMembersForm.push({ id: `memberForm${newMemberId}` });
    // currentFamilyMembersForm.push({ id: `member${familyMembers.length}` });

    setFamilyMembersForm(currentFamilyMembersForm);
    let newFamilyMembers = familyMembers.map((member) => ({ ...member }));
    newFamilyMembers.push({
      memberId: newMemberId,
      name: "",
      phone: "",
      email: "",
    });
    setFamilyMembers(newFamilyMembers);
  }

  function changeMemberInfo(e, newMemberId, index) {
    const target = e.currentTarget;
    // console.log(familyMembers);
    // let newFamilyMembers = [...familyMembers];  //只複製第一層，沒有複製內部的物件，後續處理內部物件會指向原來的陣列
    let newFamilyMembers = familyMembers.map((member) => ({ ...member })); //完全複製，後續處理內部物件會指向新的陣列

    if (target.id.startsWith("editMemberName")) {
      newFamilyMembers[index].name = target.value;
    } else if (target.id.startsWith("editMemberPhone")) {
      newFamilyMembers[index].phone = target.value;
    } else if (target.id.startsWith("editMemberEmail")) {
      newFamilyMembers[index].email = target.value;
    }
    setFamilyMembers(newFamilyMembers);
  }

  function deleteMember(removeMemberId) {
    // update familyMembers input
    let newFamilyMembersForm = familyMembersForm
      .map((memberForm) => ({
        ...memberForm,
      }))
      .filter((element) => element.id !== `memberForm${removeMemberId}`);

    setFamilyMembersForm(newFamilyMembersForm);

    let newFamilyMembers = familyMembers
      .map((member) => ({ ...member }))
      .filter((member) => member.memberId !== removeMemberId);
    setFamilyMembers(newFamilyMembers);
  }

  function packNewResidentInfo() {
    const infoPackage = {
      residentId: residentId,
      residentNumbers: residentNumbers,
      floor: floor,
      address: residentAddress,
      remark: residentRemark,
      familyMembers: familyMembers,
      updateDate: updateDateWhenEdit,
    };

    /*******************
      check input value
    ********************/
    //init input border
    for (let i = 0; i < familyMembers.length; i++) {
      const memberId = familyMembers[i].memberId;
      const editMemberNameInput = document.querySelector(
        `#editMemberName${memberId}`
      );
      const editMemberPhoneInput = document.querySelector(
        `#editMemberPhone${memberId}`
      );
      const editMemberEmailInput = document.querySelector(
        `#editMemberEmail${memberId}`
      );
      editMemberNameInput.style.border = "1px solid #96bbbb";
      editMemberPhoneInput.style.border = "1px solid #96bbbb";
      editMemberEmailInput.style.border = "1px solid #96bbbb";
    }

    //check residentNumbers
    let repeatResidentNumbers = false;
    for (let i = 0; i < lists.length; i++) {
      if (editResidentNumbers.current.value === lists[i].residentNumbers) {
        repeatResidentNumbers = true;
      }
    }

    // check remark (remark is not neccessary)
    if (editResidentRemark.current.value === "") {
      setResidentRemark("無");
    }

    //check members info
    let nameInputEmpty = 0;
    let phoneInputError = 0;
    let phoneInputEmpty = 0;
    let emailInputError = 0;
    let emailInputEmpty = 0;
    const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";

    for (let i = 0; i < familyMembers.length; i++) {
      const checkNameResult = checkUserName(familyMembers[i].name);
      const checkPhoneResult = checkUserPhone(familyMembers[i].phone);
      const checkEmailResult = checkEmailFormat(familyMembers[i].email);
      const memberId = familyMembers[i].memberId;
      const editMemberNameInput = document.querySelector(
        `#editMemberName${memberId}`
      );
      const editMemberPhoneInput = document.querySelector(
        `#editMemberPhone${memberId}`
      );
      const editMemberEmailInput = document.querySelector(
        `#editMemberEmail${memberId}`
      );

      if (checkNameResult === "姓名欄位不可留空") {
        editMemberNameInput.style.boxShadow = focusBoxShadow;
        nameInputEmpty += 1;
      }
      if (checkPhoneResult === "手機號碼不可留空") {
        editMemberPhoneInput.style.boxShadow = focusBoxShadow;
        phoneInputEmpty += 1;
      } else if (checkPhoneResult === "請填寫正確格式，如0912345678") {
        editMemberPhoneInput.style.boxShadow = focusBoxShadow;
        phoneInputError += 1;
      }

      if (checkEmailResult === "Email欄位不可留空") {
        editMemberEmailInput.style.boxShadow = focusBoxShadow;
        emailInputEmpty += 1;
      } else if (checkEmailResult === "Email格式錯誤") {
        editMemberEmailInput.style.boxShadow = focusBoxShadow;
        emailInputError += 1;
      }
    }

    // show alert
    if (repeatResidentNumbers) {
      setAlertDownward(true);
      setAlertDownwardMessage("此戶號已存在，請重新填寫");
    } else if (
      editResidentNumbers.current.value === "" ||
      editResidentAddress.current.value === "" ||
      nameInputEmpty > 0 ||
      phoneInputEmpty > 0 ||
      emailInputEmpty > 0
    ) {
      setAlertDownward(true);
      setAlertDownwardMessage("欄位不可留空");
    } else if (phoneInputError > 0) {
      setAlertDownward(true);
      setAlertDownwardMessage("請填寫正確的手機號碼格式，如0912345678");
    } else if (emailInputError > 0) {
      setAlertDownward(true);
      setAlertDownwardMessage("請填寫正確的Email格式");
    } else if (familyMembers.length < 1) {
      setAlertDownward(true);
      setAlertDownwardMessage("住戶成員不能少於一位");
    } else {
      editUpdateResident(infoPackage);
      setSuccessAlert(true);
      setSuccessMessage("住戶資訊更新成功");
      setFamilyMembersForm([]);
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
      <div className={styles.residentInfo} id={`residentInfo${residentId}`}>
        <div
          className={styles.trashImg}
          // id={`trash${index}`}
          onClick={() => {
            props.deleteResident(residentId);
          }}
        >
          <img ref={trashIconImg} src={trashIcon} />
        </div>
        <div className={styles.editImg} onClick={editResident}>
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
        <div className={`${styles.items} ${styles.itemRemark}`}>
          <div className={styles.imgWrapper}>
            <img src={remark} />
          </div>
          {props.list.remark}
        </div>
        <div className={`${styles.items} ${styles.itemMembers}`}>
          {props.list.familyMembers.map((member) => {
            return (
              <Member
                isEditing={isEditing}
                list={list}
                member={member}
                familyMembers={props.list.familyMembers}
                key={`member${member.memberId}`}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.residentInfo} id={`residentInfo${index}`}>
        <div className={styles.doneImg} onClick={packNewResidentInfo}>
          <img src={check} />
        </div>
        <div className={styles.closeImg} onClick={cancelEditing}>
          <img src={close} />
        </div>
        <div className={styles.plusImg} onClick={createMemberInput}>
          <img src={plus} />
        </div>

        <div className={`${styles.itemTitle} ${styles.titleResidentNumbers}`}>
          戶號
        </div>
        <div className={`${styles.items} ${styles.itemResidentNumbers}`}>
          <input
            ref={editResidentNumbers}
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
            ref={editResidentAddress}
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
        <div className={`${styles.items} ${styles.itemRemark}`}>
          <div className={styles.imgWrapper}>
            <img src={remark} />
          </div>
          <input
            ref={editResidentRemark}
            className={styles.editInput}
            id={`editResidentRemark${index}`}
            type="text"
            value={residentRemark}
            onChange={changeInput}
          ></input>
        </div>

        <div className={`${styles.items} ${styles.itemMembers}`}>
          {/* <MemberList list={list} isEditing={isEditing} /> */}
          {list.familyMembers.map((member) => {
            return (
              <Member
                isEditing={isEditing}
                list={list}
                member={member}
                familyMembers={familyMembers}
                familyMembersForm={familyMembersForm}
                changeMemberInfo={changeMemberInfo}
                deleteMember={deleteMember}
                key={`member${member.memberId}`}
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
