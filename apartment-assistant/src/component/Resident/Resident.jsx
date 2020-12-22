import React, { useEffect, useState, useRef } from "react";
import ResidentList from "./ResidentList/ResidentList";
import UpdateResident from "./UpdateResident";
import ConfirmMsg from "./../Common/ConfirmMsg";
import { getResidentList, deleteResidentData } from "./../../firebase";
import { scrollToTarget } from "./../../lib";
import styles from "./Resident.module.scss";
import headerImg from "./../../img/apartment.svg";
import searchImg from "./../../img/search.svg";

export default function Resident() {
  const [residentList, setResidentList] = useState([]);
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [removeResidentId, setRemoveResidentId] = useState("");

  const searchInput = useRef(null);

  /************************************* 
    get resident list and pass to state
  **************************************/
  useEffect(() => {
    getResidentList(setResidentData);
    function setResidentData(residents) {
      setResidentList(residents);
    }
  }, []);

  function searchResident(e) {
    e.preventDefault();
    const resultResident = residentList.filter(
      (list) => list.residentNumbers === searchNumber
    );
    // console.log(resultResident);
    setSearchResult(resultResident);
    setSearchNumber("");
    searchInput.current.value = "";
  }

  /*********************************************** 
    click delete button and pop up confirm dialog
  ************************************************/
  function deleteResident(residentId) {
    setRemoveResidentId(residentId);
    setShowDeleteConfirm(true);
    setConfirmMessage("刪除後無法復原，確定嗎？");
  }

  function confirmDelete(e) {
    e.preventDefault();
    let newResidentList = [...residentList];
    newResidentList.filter(
      (resident) => resident.residentId !== removeResidentId
    );
    setResidentList(newResidentList);
    deleteResidentData(removeResidentId);
    setShowDeleteConfirm(false);
  }

  function cancelConfirm(e) {
    e.preventDefault();
    setShowDeleteConfirm(false);
  }

  return (
    <div className={styles.residentPage}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={headerImg} />
          </div>
          <h3 className={styles.title}>住戶資訊</h3>
        </div>

        <form className={styles.searchContainer}>
          <input
            ref={searchInput}
            id="searchInput"
            className={styles.searchInput}
            type="text"
            placeholder="戶號"
            onChange={(e) => {
              setSearchNumber(e.currentTarget.value);
            }}
          ></input>
          <button className={styles.searchButton} onClick={searchResident}>
            <img src={searchImg} />
          </button>
        </form>

        <button
          className={styles.addBtn}
          onClick={() => {
            scrollToTarget("updateResident");
          }}
        >
          新增
        </button>
      </div>

      <ResidentList
        residentList={residentList}
        searchResult={searchResult}
        deleteResident={deleteResident}
      />
      <UpdateResident />
      <ConfirmMsg
        showConfirm={showDeleteConfirm}
        confirmMessage={confirmMessage}
        confirmAction={confirmDelete}
        cancelConfirm={cancelConfirm}
      />
    </div>
  );
}
