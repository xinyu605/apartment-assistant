import { checkPropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import styles from "./UpdateResident.module.scss";

export default function UpdateResident() {
  const [familyMembers, setFamilyMembers] = useState(["familyMembers-0"]);
  const [inputName, setInputName] = useState(["inputName-0"]);
  const [inputPhone, setInputPhone] = useState(["inputPhone-0"]);
  const [inputEmail, setInputEmail] = useState(["inputEmail-0"]);

  function createInputs(e) {
    e.preventDefault();
    let newFamilyMembers = `familyMembers-${familyMembers.length}`;
    let newInputName = `inputName-${inputName.length}`;
    let newInputPhone = `inputPhone-${inputPhone.length}`;
    let newInputEmail = `inputEmail-${inputEmail.length}`;
    setFamilyMembers([...familyMembers, newFamilyMembers]);
    setInputName([...inputName, newInputName]);
    setInputPhone([...inputPhone, newInputPhone]);
    setInputEmail([...inputEmail, newInputEmail]);
  }

  return (
    <div className={styles.updateResident}>
      <form>
        <input id="residentNumber" type="text" placeholder="請填寫戶號"></input>
        <input id="floor" placeholder="請填寫樓層"></input>
        <input id="address" placeholder="請填寫地址"></input>
        <input id="remark" type="text" placeholder="請填寫備註"></input>
        <div className={styles.familyMemberList}>
          <h3>住戶成員</h3>
          <input id="inputName-0" type="text" placeholder="請填寫姓名"></input>
          <input
            id="inputPhone-0"
            type="text"
            placeholder="請填寫聯絡電話"
          ></input>
          <input
            id="inputEmail-0"
            type="text"
            placeholder="請填寫Email"
          ></input>
          {/* <FamilyMembers /> */}
          <FamilyMembers
            familyMembers={familyMembers}
            inputName={inputName}
            inputPhone={inputPhone}
            inputEmail={inputEmail}
          />
          <button id="createMemberInput" onClick={createInputs}>
            +
          </button>
          <button id="deleteMemberInput">-</button>
        </div>
      </form>
    </div>
  );
}

function FamilyMembers(props) {
  let familyMembers = props.familyMembers;
  return (
    <div className={styles.familyMembers}>
      <input type="text" placeholder="請填寫姓名"></input>
      <input type="text" placeholder="請填寫聯絡電話"></input>
      <input type="text" placeholder="請填寫Email"></input>
    </div>
  );
}
