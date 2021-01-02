import React, { useRef, useState } from "react";
import Alertbox from "./../Common/Alertbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import styles from "./UpdateResident.module.scss";
import { uploadResident, transferToFirebaseTimeStamp } from "./../../firebase";
import { nanoid } from "nanoid";
import memberIcon from "./../../img/members.svg";
import plus from "./../../img/plus555.svg";
import minus from "./../../img/minus555.svg";
import {
  checkEmailFormat,
  checkNumbers,
  checkUserName,
  checkUserPhone,
} from "./../../utils/lib";

export default function UpdateResident(props) {
  const [familyMembersForm, setFamilyMemberForm] = useState([
    { id: "member0" },
  ]);
  const [repeatResidentNumbers, setRepeatResidentNumbers] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const residentNumbers = useRef(null);
  const floor = useRef(null);
  const address = useRef(null);
  const remark = useRef(null);
  const remindFloor = useRef(null);
  const remindResidentNumbers = useRef(null);

  /**************************************************
  Create / Delete one more family member input form
  ***************************************************/

  function createInputs(e) {
    e.preventDefault();
    setFamilyMemberForm([
      ...familyMembersForm,
      { id: `member${familyMembersForm.length}` },
    ]);
  }

  function deleteLastInput(e) {
    e.preventDefault();
    let newFamilyMembersForm = [...familyMembersForm];
    newFamilyMembersForm.pop();
    setFamilyMemberForm(newFamilyMembersForm);
  }

  /*********************************
  Check input when user input value
  **********************************/
  function checkRemind(e) {
    switch (e.currentTarget.id) {
      case "floor":
        const result = checkNumbers(e.currentTarget.value);
        if (result || result === undefined) {
          remindFloor.current.style.height = "0px";
          remindFloor.current.style.opacity = "0";
        } else {
          remindFloor.current.style.height = "12px";
          remindFloor.current.style.opacity = "1";
        }
        break;
      case "residentNumbers":
        let residentNumbersExist = false;
        for (let i = 0; i < props.residentList.length; i++) {
          if (e.currentTarget.value === props.residentList[i].residentNumbers) {
            residentNumbersExist = true;
            break;
          }
        }
        if (residentNumbersExist) {
          remindResidentNumbers.current.style.height = "12px";
          remindResidentNumbers.current.style.opacity = "1";
          setRepeatResidentNumbers(true);
        } else {
          remindResidentNumbers.current.style.height = "0px";
          remindResidentNumbers.current.style.opacity = "0";
          setRepeatResidentNumbers(false);
        }
        break;
      default:
        break;
    }
  }

  /************************
  Packing user's input value
  **************************/

  function packingInfo(e) {
    e.preventDefault();
    let inputs = document.querySelectorAll("input");
    let familyMembers = [];

    if (remark.current.value === "") {
      remark.current.value = "無";
    }

    // check name, phone, email input format
    // init
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].style.boxShadow = "none";
    }
    let nameInputEmpty = 0;
    let phoneInputError = 0;
    let phoneInputEmpty = 0;
    let emailInputError = 0;
    let emailInputEmpty = 0;
    const focusBoxShadow = "0px 0px 5px 3px rgba(243, 196, 95, 0.52)";
    const remindEmptyMessage = "請補填此欄位";

    for (let i = 0; i < familyMembersForm.length; i++) {
      const inputName = document.querySelector(`#inputName${i}`);
      const inputPhone = document.querySelector(`#inputPhone${i}`);
      const inputEmail = document.querySelector(`#inputEmail${i}`);

      familyMembers[i] = {
        memberId: nanoid(20),
        name: inputName.value,
        phone: inputPhone.value,
        email: inputEmail.value,
      };

      //check input format
      const checkNameResult = checkUserName(familyMembers[i].name);
      const checkPhoneResult = checkUserPhone(familyMembers[i].phone);
      const checkEmailResult = checkEmailFormat(familyMembers[i].email);
      if (checkNameResult === "姓名欄位不可留空") {
        inputName.style.boxShadow = focusBoxShadow;
        inputName.placeholder = remindEmptyMessage;
        nameInputEmpty += 1;
      }
      if (checkPhoneResult === "手機號碼不可留空") {
        inputPhone.style.boxShadow = focusBoxShadow;
        inputPhone.placeholder = remindEmptyMessage;
        phoneInputEmpty += 1;
      } else if (checkPhoneResult === "請填寫正確格式，如0912345678") {
        inputPhone.style.boxShadow = focusBoxShadow;
        phoneInputError += 1;
      }

      if (checkEmailResult === "Email欄位不可留空") {
        inputEmail.style.boxShadow = focusBoxShadow;
        inputEmail.placeholder = remindEmptyMessage;
        emailInputEmpty += 1;
      } else if (checkEmailResult === "Email格式錯誤") {
        inputEmail.style.boxShadow = focusBoxShadow;
        emailInputError += 1;
      }
    }

    const updateTime = new Date();
    const year = updateTime.getFullYear();
    const month = updateTime.getMonth() + 1;
    const date = updateTime.getDate();
    const secondsToFirebase = transferToFirebaseTimeStamp(year, month, date);
    // console.log(secondsToFirebase);

    const infoPackage = {
      residentNumbers: residentNumbers.current.value,
      floor: floor.current.value,
      address: address.current.value,
      remark: remark.current.value,
      familyMembers: familyMembers,
      updateDate: secondsToFirebase,
    };

    if (residentNumbers.current.value === "") {
      residentNumbers.current.style.boxShadow = focusBoxShadow;

      residentNumbers.current.placeholder = remindEmptyMessage;
    }
    if (floor.current.value === "") {
      floor.current.style.boxShadow = focusBoxShadow;
      floor.current.placeholder = remindEmptyMessage;
    }
    if (address.current.value === "") {
      address.current.style.boxShadow = focusBoxShadow;
      address.current.placeholder = remindEmptyMessage;
    }

    if (repeatResidentNumbers) {
      setShowAlert(true);
      setAlertMessage("此戶號已存在，請重新輸入或更新住戶資訊");
    } else if (phoneInputError > 0) {
      setShowAlert(true);
      setAlertMessage("請填寫正確的手機號碼格式，如0912345678");
    } else if (emailInputError > 0) {
      setShowAlert(true);
      setAlertMessage("請填寫正確的Email格式");
    } else if (familyMembers.length < 1) {
      setShowAlert(true);
      setAlertMessage("住戶成員不能少於一位");
    } else if (
      residentNumbers.current.value === "" ||
      floor.current.value === "" ||
      address.current.value === "" ||
      nameInputEmpty > 0 ||
      phoneInputEmpty > 0 ||
      emailInputEmpty > 0
    ) {
      setShowAlert(true);
      setAlertMessage("欄位不可留空");
    } else {
      uploadResident(infoPackage);
      setSuccessAlert(true);
      setSuccessMessage("新增住戶成功");
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.setTimeout(() => {
        setSuccessAlert(false);
      }, 2000);

      // back to default placeholer
      residentNumbers.current.placeholder = "請填寫戶號";
      floor.current.placeholder = "請填寫數字";
      address.current.placeholder = "請填寫地址";
      remark.current.placeholder = "請填寫備註 (非必填)";
      window.setTimeout(() => {
        setFamilyMemberForm([{ id: "member0" }]);
      }, 1000);

      for (let i = 0; i < familyMembersForm.length; i++) {
        document.querySelector(`#inputName${i}`).placeholder = "請填寫姓名";
        document.querySelector(`#inputPhone${i}`).placeholder =
          "請填寫手機號碼";
        document.querySelector(`#inputEmail${i}`).placeholder = "請填寫Email";
      }
      for (let i = 1; i < inputs.length; i++) {
        inputs[i].value = "";
      }
    }
  }

  return (
    <div className={styles.updateResident} id="updateResident">
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={memberIcon} />
        </div>
        <h2 className={styles.title}>新增住戶</h2>
      </div>
      <form className={styles.updateResidentDetails}>
        <div className={styles.basicInfo}>
          <label
            className={`${styles.detailTitle} ${styles.titleResidentNumbers}`}
          >
            戶號
          </label>
          <input
            ref={residentNumbers}
            className={`${styles.detailInput} ${styles.inputResidentNumbers}`}
            id="residentNumbers"
            type="text"
            placeholder="請填寫戶號"
            onChange={checkRemind}
          ></input>
          <div
            ref={remindResidentNumbers}
            className={`${styles.remindMessage} ${styles.remindResidentNumbers}`}
          >
            此戶號已存在
          </div>
          <label className={`${styles.detailTitle} ${styles.titleFloor}`}>
            樓層
          </label>
          <input
            ref={floor}
            className={`${styles.detailInput} ${styles.inputFloor}`}
            id="floor"
            placeholder="請填寫數字"
            onChange={checkRemind}
          ></input>
          <div
            ref={remindFloor}
            className={`${styles.remindMessage} ${styles.remindFloor}`}
          >
            請填寫開頭不為0的純數字
          </div>
          <label className={`${styles.detailTitle} ${styles.titleAddress}`}>
            地址
          </label>
          <input
            ref={address}
            className={`${styles.detailInput} ${styles.inputAddress}`}
            id="address"
            placeholder="請填寫地址"
          ></input>
          <label className={`${styles.detailTitle} ${styles.titleRemark}`}>
            備註
          </label>
          <input
            ref={remark}
            className={`${styles.detailInput} ${styles.inputRemark}`}
            id="remark"
            type="text"
            placeholder="請填寫備註 (非必填)"
          ></input>
        </div>

        <div className={styles.familyMemberList}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>住戶成員</h3>
            <div className={styles.buttonContainer}>
              <button
                className={styles.buttonMemberList}
                onClick={createInputs}
              >
                <img src={plus} />
              </button>
              <button
                className={styles.buttonMemberList}
                onClick={deleteLastInput}
              >
                <img src={minus} />
              </button>
            </div>
          </div>

          {familyMembersForm.map((item) => {
            return (
              <FamilyMembers id={`family${item.id}`} key={`family${item.id}`} />
            );
          })}
        </div>
        <button className={styles.submitMemberList} onClick={packingInfo}>
          確認送出
        </button>
        {showAlert && (
          <Alertbox
            category={"updateResident"}
            alertMessage={alertMessage}
            closeAlert={() => {
              setShowAlert(false);
            }}
          />
        )}
      </form>
      {showSuccessAlert && <AlertSuccessMsg successMessage={successMessage} />}
    </div>
  );
}

function FamilyMembers(props) {
  const number = props.id.slice(12);
  return (
    <div className={styles.familyMember} id={`${props.id}`} key={`${props.id}`}>
      <label className={styles.familyTitle}>姓名</label>
      <input
        className={styles.familyInput}
        id={`inputName${number}`}
        type="text"
        placeholder="請填寫姓名"
      ></input>
      <label className={styles.familyTitle}>聯絡電話</label>
      <input
        className={styles.familyInput}
        id={`inputPhone${number}`}
        type="text"
        placeholder="請填寫手機號碼"
      ></input>
      <label className={styles.familyTitle}>Email</label>
      <input
        className={styles.familyInput}
        id={`inputEmail${number}`}
        type="text"
        placeholder="請填寫Email"
      ></input>
    </div>
  );
}
