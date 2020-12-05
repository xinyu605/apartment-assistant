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
  const [memberNameList, setMemberNameList] = useState([]);
  const [memberPhoneList, setMemberPhoneList] = useState([]);
  const [memberEmailList, setMemberEmailList] = useState([]);

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
    let residentNumbers = document.querySelector("#residentNumbers").value;
    let floor = parseInt(document.querySelector("#floor").value);
    let address = document.querySelector("#address").value;
    let remark = document.querySelector("#remark").value;
    let nameList = [];
    let phoneList = [];
    let emailList = [];
    for (let i = 0; i < familyMembersForm.length; i++) {
      nameList[i] = document.querySelector(`#inputName${i}`).value;
      phoneList[i] = document.querySelector(`#inputPhone${i}`).value;
      emailList[i] = document.querySelector(`#inputEmail${i}`).value;
    }

    setResidentNumbers(residentNumbers);
    setFloor(floor);
    setAddress(address);
    setRemark(remark);
    setMemberNameList(nameList);
    setMemberPhoneList(phoneList);
    setMemberEmailList(emailList);
  }

  /****************************
   FamilyMembersForm component
   ****************************/

  const FamilyMemberForm = familyMembersForm.map((item) => {
    return <FamilyMembers id={`family${item.id}`} key={`family${item.id}`} />;
  });

  return (
    <div className={styles.updateResident}>
      <form>
        <input
          id="residentNumbers"
          type="text"
          placeholder="請填寫戶號"
        ></input>
        <input id="floor" placeholder="請填寫樓層"></input>
        <input id="address" placeholder="請填寫地址"></input>
        <input id="remark" type="text" placeholder="請填寫備註"></input>
        <div className={styles.familyMemberList}>
          <h3>住戶成員</h3>
          {FamilyMemberForm}
          <button onClick={createInputs}>+</button>
          <button onClick={deleteLastInput}>-</button>
        </div>
        <button onClick={packingInfo}>確定</button>
      </form>
    </div>
  );
}

function FamilyMembers(props) {
  const number = props.id.slice(12);
  return (
    <div className={styles.familyMember} id={`${props.id}`} key={`${props.id}`}>
      <input
        id={`inputName${number}`}
        type="text"
        placeholder="請填寫姓名"
      ></input>
      <input
        id={`inputPhone${number}`}
        type="text"
        placeholder="請填寫聯絡電話"
      ></input>
      <input
        id={`inputEmail${number}`}
        type="text"
        placeholder="請填寫Email"
      ></input>
    </div>
  );
}
