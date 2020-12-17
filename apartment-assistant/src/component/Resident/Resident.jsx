import React, { useEffect, useState } from "react";
import ResidentList from "./ResidentList/ResidentList";
import UpdateResident from "./UpdateResident";
import { getResidentList, deleteResidentData } from "./../../firebase";
import { scrollToTarget } from "./../../lib";
import styles from "./Resident.module.scss";
import headerImg from "./../../img/home.svg";
import searchImg from "./../../img/search.svg";

export default function Resident() {
  const [residentList, setResidentList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

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
    const searchNumber = document.querySelector("#searchInput").value;
    // console.log(searchNumber);
    const resultResident = residentList.filter(
      (list) => list.residentNumbers === searchNumber
    );
    // console.log(resultResident);
    setSearchResult(resultResident);
  }

  function deleteResident(e) {
    let ans = window.confirm("刪了就回不去囉！你確定？");
    if (ans) {
      const index = parseInt(e.currentTarget.id.slice(5));
      let newResidentList = [...residentList];
      const removedResident = newResidentList.splice(index, 1);
      setResidentList(newResidentList);
      deleteResidentData(removedResident[0].residentId);
    }
  }

  // function editResident(e) {
  //   console.log(e.currentTarget.id);
  // }

  return (
    <div className={styles.residentPage}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <div className={styles.titleImg}>
            <img src={headerImg} />
          </div>
          <h3 className={styles.title}>住戶資訊</h3>
        </div>

        <div className={styles.searchContainer}>
          <input
            id="searchInput"
            className={styles.searchInput}
            type="text"
            placeholder="戶號"
          ></input>
          <div className={styles.searchButton} onClick={searchResident}>
            <img src={searchImg} />
          </div>
        </div>

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
        // editResident={editResident}
      />
      <UpdateResident />
    </div>
  );
}
