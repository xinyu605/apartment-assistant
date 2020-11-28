import React, { useEffect, useState } from "react";
import { UntakenMailList } from "./UntakenMailList";
import { UpdateMailList } from "./UpdateMailList";
import { getMailList } from "./../firebase";

/*****************************
 Mailbox component:
 1.Get data from Firestore
 2.Render 
******************************/

function Mailbox() {
  const [data, setData] = useState([]);
  // useEffect will run only after an initial render, and after an update on data is occurred
  useEffect(() => {
    getMailList(false).then((mailList) => {
      console.log(mailList);
      // setData((data) => [...data, mailList]);
      setData(mailList);
    });
  }, []); //[]內放需要監聽(有變動就要執行function)的state

  return (
    <div>
      <h2>信件包裹紀錄</h2>
      <UntakenMailList list={data} />
      <UpdateMailList />
    </div>
  );
}

export default Mailbox;
