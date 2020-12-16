import React, { useEffect, useState } from "react";
import ListCard from "./ListCard";
import styles from "./ResidentList.module.scss";

export default function ResidentList(props) {
  let lists = [];
  let resultList = props.searchResult;
  // console.log(resultList);

  if (resultList.length !== 0) {
    lists = resultList;
  } else {
    lists = props.residentList;
  }

  return (
    <div className={styles.residentList}>
      {lists.map((list) => {
        const index = lists.indexOf(list);
        return (
          <ListCard
            list={list}
            lists={lists}
            deleteResident={props.deleteResident}
            // editResident={props.editResident}
            key={`residentCard${index}`}
          />
        );
      })}
    </div>
  );
}
