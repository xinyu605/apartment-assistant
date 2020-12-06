import React, { useState } from "react";
import styles from "./UpdateResident.module.scss";
import { uploadResident, getTimeStamp } from "./../../firebase";
import memberIcon1 from "./../../img/members1.svg";
import memberIcon2 from "./../../img/members2.svg";

export default function UpdateResident() {
  const [familyMembersForm, setFamilyMemberForm] = useState([
    { id: "member0" },
  ]);

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
    familyMembersForm.pop();
    console.log(familyMembersForm);
    setFamilyMemberForm(familyMembersForm); //bug: 無法順利更新 familyMemberForm state
  }

  /************************
  Packing user's input value
  **************************/

  function packingInfo(e) {
    e.preventDefault();
    let message = false;
    let inputs = document.querySelectorAll("input");

    let residentNumbers = document.querySelector("#residentNumbers").value;
    let floor = parseInt(document.querySelector("#floor").value);
    let address = document.querySelector("#address").value;
    let remark = document.querySelector("#remark").value;
    let familyMembers = [];

    if (remark === "") {
      remark = "無";
    }

    for (let i = 0; i < familyMembersForm.length; i++) {
      familyMembers[i] = {
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
      residentNumbers: residentNumbers,
      floor: floor,
      address: address,
      remark: remark,
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
      alert("還有空白欄位尚未填寫完成喔！");
      message = false;
    } else {
      uploadResident(infoPackage);
      for (let i = 1; i < inputs.length; i++) {
        inputs[i].value = "";
      }
    }
  }

  /****************************
   FamilyMembersForm component
   ****************************/

  const FamilyMemberForm = familyMembersForm.map((item) => {
    return <FamilyMembers id={`family${item.id}`} key={`family${item.id}`} />;
  });

  return (
    <div className={styles.updateResident}>
      <div className={styles.titleContainer}>
        <div className={styles.titleImg}>
          <img src={memberIcon1} />
        </div>
        <h3 className={styles.title}>新增住戶</h3>
      </div>
      <form className={styles.updateResidentDetails}>
        <div className={styles.basicInfo}>
          <label
            className={`${styles.detailTitle} ${styles.titleResidentNumbers}`}
          >
            戶號
          </label>
          <input
            className={`${styles.detailInput} ${styles.inputResidentNumbers}`}
            id="residentNumbers"
            type="text"
            placeholder="請填寫戶號"
          ></input>
          <label className={`${styles.detailTitle} ${styles.titleFloor}`}>
            樓層
          </label>
          <input
            className={`${styles.detailInput} ${styles.inputFloor}`}
            id="floor"
            placeholder="請填寫樓層"
          ></input>
          <label className={`${styles.detailTitle} ${styles.titleAddress}`}>
            地址
          </label>
          <input
            className={`${styles.detailInput} ${styles.inputAddress}`}
            id="address"
            placeholder="請填寫地址"
          ></input>
          <label className={`${styles.detailTitle} ${styles.titleRemark}`}>
            備註
          </label>
          <input
            className={`${styles.detailInput} ${styles.inputRemark}`}
            id="remark"
            type="text"
            placeholder="請填寫備註"
          ></input>
        </div>

        <div className={styles.familyMemberList}>
          <div className={styles.titleContainer}>
            <div className={styles.titleImg}>
              <img src={memberIcon2} />
            </div>
            <h3 className={styles.title}>住戶成員</h3>
            <div className={styles.buttonContainer}>
              <button
                className={styles.buttonMemberList}
                onClick={createInputs}
              >
                +
              </button>
              <button
                className={styles.buttonMemberList}
                onClick={deleteLastInput}
              >
                -
              </button>
            </div>
          </div>

          {FamilyMemberForm}
        </div>
        <button className={styles.submitMemberList} onClick={packingInfo}>
          確定
        </button>
      </form>
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
