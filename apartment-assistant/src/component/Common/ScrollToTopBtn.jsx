import React, { useEffect } from "react";
import styles from "./ScrollToTopBtn.module.scss";
import arrowUp from "./../../img/arrowUp.svg";

export default function ScrollToTopBtn() {
  useEffect(() => {
    const btn = document.querySelector("#scrollBtn");
    window.onscroll = function () {
      showScrollBtn();
    };

    function showScrollBtn() {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        btn.style.transform = "translateY(-80px)";
        btn.style.transition = "all 0.4s ease";
      } else {
        btn.style.transform = "translateY(0)";
        btn.style.transition = "all 0.4s ease";
      }
    }
  });

  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.body.scrollTop = 0; // for safari
    // document.documentElement.scrollTop = 0; //for Chrome, Firefox, and Opera
    // document.body.scrollIntoView({ behavior: "smooth" });
    // document.documentElement.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <button id="scrollBtn" className={styles.scrollBtn} onClick={scrollToTop}>
      <img src={arrowUp} />
    </button>
  );
}
