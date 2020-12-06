import React, { useEffect, useState } from "react";
import ResidentList from "./ResidentList";
import UpdateResident from "./UpdateResident";
import { getResidentList } from "./../../firebase";
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
    let isMounted = true; // note this flag denote mount status
    getResidentList().then((residents) => {
      if (isMounted) setResidentList(residents);
    });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
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
    const index = parseInt(e.currentTarget.id.slice(5));
    residentList.splice(index, 1);
    console.log(residentList);
    setResidentList(residentList);
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
      />
      <UpdateResident />
    </div>
  );
}
