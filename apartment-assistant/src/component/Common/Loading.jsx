import React from "react";
import styles from "./Loading.module.scss";
import logo from "./../../img/logo_apartment.png";

export default function Loading(props) {
  if (props.isLoading) {
    return (
      <div className={styles.loadingComponent}>
        <div className={styles.loadingCard}>
          <div className={styles.imgWrapper}>
            <img src={logo} />
          </div>
          <div className={styles.loadingText}>
            Loading<span className={styles.circle}></span>
            <span className={styles.circle}></span>
            <span className={styles.circle}></span>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
