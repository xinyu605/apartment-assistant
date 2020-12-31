import React, { useState, useRef, useEffect } from "react";
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
import {
  transferToFirebaseTimeStamp,
  updateDocById,
} from "./../../../firebase";
import { nanoid } from "nanoid";
import {
  checkEmailFormat,
  checkUserName,
  checkUserPhone,
  showDate,
} from "./../../../utils/lib";

export default function ListCard(props) {
  const lists = props.lists;
  const list = props.list;
  const [isEditing, setEditing] = useState(false);
  const [fillInMemberName, setFillInMemberName] = useState([]);
  const [fillInMemberPhone, setFillInMemberPhone] = useState([]);
  const [fillInMemberEmail, setFillInMemberEmail] = useState([]);
  const [floor, setFloor] = useState(props.list.floor);
  const [residentNumbers, setResidentNumbers] = useState(list.residentNumbers);
  const [residentAddress, setResidentAddress] = useState(list.address);
  const [residentRemark, setResidentRemark] = useState(list.remark);
  const [updateDateWhenEdit, setUpdateDateWhenEdit] = useState(list.updateDate);
  const [showDateWhenEditing, setDateWhenEditing] = useState("");
  const [familyMembers, setFamilyMembers] = useState(list.familyMembers);
  const [familyMembersForm, setFamilyMembersForm] = useState([]);

  const [showAlertDownward, setAlertDownward] = useState(false);
  const [alertDownwardMessage, setAlertDownwardMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const trashIconImg = useRef(null);
  const editResidentNumbers = useRef(null);
  const editResidentAddress = useRef(null);
  const editResidentRemark = useRef(null);

  let index = lists.indexOf(list);
  let updateDate = "";

  if (list.updateDate) {
    updateDate = showDate(list.updateDate.seconds);
  }

  useEffect(() => {
    const newFillInMemberName = [];
    const newFillInMemberPhone = [];
    const newFillInMemberEmail = [];
    for (let i = 0; i < familyMembers.length; i++) {
      newFillInMemberName.push(true);
      newFillInMemberPhone.push(true);
      newFillInMemberEmail.push(true);
    }
    setFillInMemberName(newFillInMemberName);
    setFillInMemberPhone(newFillInMemberPhone);
    setFillInMemberEmail(newFillInMemberEmail);
  }, [familyMembers]);

  function editResident(e) {
    setEditing(true);

    const editYear = new Date().getFullYear();
    const editMonth = new Date().getMonth() + 1;
    const editDate = new Date().getDate();
    const secondsToFirebase = transferToFirebaseTimeStamp(
      editYear,
      editMonth,
      editDate
    );
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
    const newMemberId = nanoid(20);
    let currentFamilyMembersForm = familyMembersForm.map((memberForm) => ({
      ...memberForm,
    }));
    currentFamilyMembersForm.push({ id: `memberForm${newMemberId}` });

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

  function checkResidentNumbersInput() {
    let repeatResidentNumbers = false;
    for (let i = 0; i < lists.length; i++) {
      if (editResidentNumbers.current.value === lists[i].residentNumbers) {
        repeatResidentNumbers = true;
      }
    }
    if (editResidentNumbers.current.value === lists[index].residentNumbers) {
      //self
      repeatResidentNumbers = false;
    }
    return repeatResidentNumbers;
  }

  function checkMemberInfoInput() {
    let emptyInputCount = 0;
    let phoneInputError = 0;
    let emailInputError = 0;
    const newFillInMemberName = [];
    const newFillInMemberPhone = [];
    const newFillInMemberEmail = [];

    for (let i = 0; i < familyMembers.length; i++) {
      const checkNameResult = checkUserName(familyMembers[i].name);
      const checkPhoneResult = checkUserPhone(familyMembers[i].phone);
      const checkEmailResult = checkEmailFormat(familyMembers[i].email);

      if (checkNameResult === true) {
        newFillInMemberName.push(true);
      } else if (checkNameResult === "姓名欄位不可留空") {
        newFillInMemberName.push(false);
        emptyInputCount += 1;
      }

      if (checkPhoneResult === true) {
        newFillInMemberPhone.push(true);
      } else if (checkPhoneResult === "手機號碼不可留空") {
        newFillInMemberPhone.push(false);
        emptyInputCount += 1;
      } else if (checkPhoneResult === "請填寫正確格式，如0912345678") {
        newFillInMemberPhone.push(false);
        phoneInputError += 1;
      }

      if (checkEmailResult === true) {
        newFillInMemberEmail.push(true);
      } else if (checkEmailResult === "Email欄位不可留空") {
        newFillInMemberEmail.push(false);
        emptyInputCount += 1;
      } else if (checkEmailResult === "Email格式錯誤") {
        newFillInMemberEmail.push(false);
        emailInputError += 1;
      }

      setFillInMemberName(newFillInMemberName);
      setFillInMemberPhone(newFillInMemberPhone);
      setFillInMemberEmail(newFillInMemberEmail);
    }
    return {
      emptyInputCount: emptyInputCount,
      phoneInputError: phoneInputError,
      emailInputError: emailInputError,
    };
  }

  function packNewResidentInfo() {
    const infoPackage = {
      residentNumbers: residentNumbers,
      floor: floor,
      address: residentAddress,
      remark: residentRemark,
      familyMembers: familyMembers,
      updateDate: updateDateWhenEdit,
    };

    const repeatResidentNumbers = checkResidentNumbersInput();
    const errorRecord = checkMemberInfoInput();

    if (editResidentRemark.current.value === "") {
      setResidentRemark("無");
    }

    if (repeatResidentNumbers) {
      setAlertDownward(true);
      setAlertDownwardMessage("此戶號已存在，請重新填寫");
    } else if (
      editResidentNumbers.current.value === "" ||
      editResidentAddress.current.value === "" ||
      errorRecord.emptyInputCount > 0
    ) {
      setAlertDownward(true);
      setAlertDownwardMessage("欄位不可留空");
    } else if (errorRecord.phoneInputError > 0) {
      setAlertDownward(true);
      setAlertDownwardMessage("請填寫正確的手機號碼格式，如0912345678");
    } else if (errorRecord.emailInputError > 0) {
      setAlertDownward(true);
      setAlertDownwardMessage("請填寫正確的Email格式");
    } else if (familyMembers.length < 1) {
      setAlertDownward(true);
      setAlertDownwardMessage("住戶成員不能少於一位");
    } else {
      updateDocById("residents", list.residentId, infoPackage);
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

  function closeAlert(e) {
    e.preventDefault();
    setAlertDownward(false);
  }

  if (isEditing === false) {
    return (
      <div
        className={styles.residentInfo}
        id={`residentInfo${list.residentId}`}
      >
        <div
          className={styles.trashImg}
          onClick={() => {
            props.deleteResident(list.residentId);
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
          {list.familyMembers.map((member) => {
            return (
              <Member
                isEditing={isEditing}
                fillInMemberName={fillInMemberName}
                fillInMemberPhone={fillInMemberPhone}
                fillInMemberEmail={fillInMemberEmail}
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
