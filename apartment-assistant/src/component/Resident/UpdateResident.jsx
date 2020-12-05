import { checkPropTypes } from "prop-types";
import React, { useEffect, useState } from "react";
import styles from "./UpdateResident.module.scss";

export default function UpdateResident() {
  const [familyMembersForm, setFamilyMemberForm] = useState([
    { id: "member0" },
  ]);
  const [residentNumbers, setResidentNumbers] = useState("");
  const [floor, setFloor] = useState(0);
  const [address, setAddress] = useState("");
  const [remark, setRemark] = useState("無");

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

  const FamilyMemberForm = familyMembersForm.map((item) => {
    return (
      <FamilyMembers
        id={`familyMembers${item.id}`}
        key={`familyMembers${item.id}`}
      />
    );
  });

  /************************
 Get user's input value
 ***********************/
  function updateInfo(e) {
    let inputValue = e.currentTarget.value;
    switch (e.currentTarget.id) {
      case "residentNumbers":
        setResidentNumbers(inputValue);
        break;
      case "floor":
        setFloor(parseInt(inputValue));
        break;
      case "address":
        setAddress(inputValue);
        break;
      case "remark":
        setRemark(inputValue);
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.updateResident}>
      <form>
        <input
          id="residentNumbers"
          type="text"
          placeholder="請填寫戶號"
          onChange={updateInfo}
        ></input>
        <input
          id="floor"
          placeholder="請填寫樓層"
          onChange={updateInfo}
        ></input>
        <input
          id="address"
          placeholder="請填寫地址"
          onChange={updateInfo}
        ></input>
        <input
          id="remark"
          type="text"
          placeholder="請填寫備註"
          onChange={updateInfo}
        ></input>
        <div className={styles.familyMemberList}>
          <h3>住戶成員</h3>
          {FamilyMemberForm}
          <button onClick={createInputs}>+</button>
          <button onClick={deleteLastInput}>-</button>
        </div>
      </form>
    </div>
  );
}

function FamilyMembers(props) {
  console.log(props);
  return (
    <div
      className={styles.familyMember}
      id={`familymember${props.id}`}
      key={`familymember${props.id}`}
    >
      <input
        id={`inputName${props.id}`}
        type="text"
        placeholder="請填寫姓名"
        // onChange={updateMemberName}
      ></input>
      <input
        id={`inputPhone${props.id}`}
        type="text"
        placeholder="請填寫聯絡電話"
      ></input>
      <input
        id={`inputEmail${props.id}`}
        type="text"
        placeholder="請填寫Email"
      ></input>
    </div>
  );
}
