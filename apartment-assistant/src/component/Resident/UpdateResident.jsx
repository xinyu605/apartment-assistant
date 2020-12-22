import React, { useRef, useState } from "react";
import Alertbox from "./../Common/Alertbox";
import AlertSuccessMsg from "./../Common/AlertSuccessMsg";
import styles from "./UpdateResident.module.scss";
import { uploadResident, getTimeStamp } from "./../../firebase";
import { nanoid } from "nanoid";
import memberIcon1 from "./../../img/members.svg";
import plus from "./../../img/plus.svg";
import minus from "./../../img/minus.svg";
import { checkNumbers } from "../../lib";

export default function UpdateResident() {
  const [familyMembersForm, setFamilyMemberForm] = useState([
    { id: "member0" },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const residentNumbers = useRef(null);
  const floor = useRef(null);
  const address = useRef(null);
  const remark = useRef(null);
  const remindFloor = useRef(null);

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
    const result = checkNumbers(e.currentTarget.value);
    if (result || result === undefined) {
      remindFloor.current.style.display = "none";
    } else {
      remindFloor.current.style.display = "block";
    }
  }

  /************************
  Packing user's input value
  **************************/

  function packingInfo(e) {
    e.preventDefault();
    let message = false;
    let inputs = document.querySelectorAll("input");
    let familyMembers = [];

    if (remark.current.value === "") {
      remark.current.value = "無";
    }

    for (let i = 0; i < familyMembersForm.length; i++) {
      familyMembers[i] = {
        memberId: nanoid(20),
        name: document.querySelector(`#inputName${i}`).value,
        phone: document.querySelector(`#inputPhone${i}`).value,
        email: document.querySelector(`#inputEmail${i}`).value,
      };
    }

    const updateTime = new Date();
    const year = updateTime.getFullYear();
    const month = updateTime.getMonth() + 1;
    const date = updateTime.getDate();
    const secondsToFirebase = getTimeStamp(year, month, date);
    // console.log(secondsToFirebase);

    const infoPackage = {
      residentNumbers: residentNumbers.current.value,
      floor: floor.current.value,
      address: address.current.value,
      remark: remark.current.value,
      familyMembers: familyMembers,
      updateDate: secondsToFirebase,
    };

    // console.log(inputs);
    for (let i = 1; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        inputs[i].classList.add(styles.focus);
        message = true;
      }
    }

    if (message) {
      // alert("還有空白欄位尚未填寫完成喔！");
      // message = false;
      setShowAlert(true);
    } else {
      uploadResident(infoPackage);
      setSuccessAlert(true);
      setSuccessMessage("新增住戶成功");

      for (let i = 1; i < inputs.length; i++) {
        inputs[i].value = "";
      }
    }
  }

  /*********** 
  Close alert
  ************/
  function closeAlert(e) {
    e.preventDefault();
    switch (e.currentTarget.id) {
      case "closeAlertBtn":
        setShowAlert(false);
        break;
      case "closeSuccessMsgBtn":
        setSuccessAlert(false);
        break;
      default:
        break;
    }
  }

  /****************************
    FamilyMembersForm component
   ****************************/

  const FamilyMemberForm = familyMembersForm.map((item) => {
    return <FamilyMembers id={`family${item.id}`} key={`family${item.id}`} />;
  });

  return (
    <div className={styles.updateResident} id="updateResident">
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={memberIcon1} />
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
          ></input>
          <label className={`${styles.detailTitle} ${styles.titleFloor}`}>
            樓層
          </label>
          <input
            ref={floor}
            className={`${styles.detailInput} ${styles.inputFloor}`}
            id="floor"
            placeholder="請填寫數字 ex.2"
            onChange={checkRemind}
          ></input>
          <div ref={remindFloor} className={styles.remindFloor}>
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

          {FamilyMemberForm}
        </div>
        <button className={styles.submitMemberList} onClick={packingInfo}>
          確認送出
        </button>
        <Alertbox showAlert={showAlert} closeAlert={closeAlert} />
      </form>
      <AlertSuccessMsg
        showSuccessAlert={showSuccessAlert}
        successMessage={successMessage}
        closeAlert={closeAlert}
      />
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
        placeholder="請填寫聯絡電話"
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
