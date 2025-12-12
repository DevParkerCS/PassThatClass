import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.scss";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const Nav = () => {
  const auth = useAuthContext();
  const nav = useNavigate();

  const handleSignout = async () => {
    try {
      await auth.handleLogout();
      nav("/");
    } catch (e) {
      console.log("Error signing out");
    }
  };

  return (
    <div className={styles.topContent}>
      <nav className={styles.navWrapper}>
        <div>
          <h1 className={styles.navTitle} onClick={() => nav("/")}>
            PassThatClass
          </h1>
        </div>

        <div className={styles.navItems}>
          <p className={styles.navItem} onClick={() => nav("/")}>
            Home
          </p>
          {auth.session ? (
            <p className={styles.navItem} onClick={() => nav("/dashboard")}>
              Dashboard
            </p>
          ) : (
            <p className={styles.navItem} onClick={() => nav("/login")}>
              Login/Signup
            </p>
          )}

          {auth.session && (
            <p className={styles.navItem} onClick={() => nav("/account")}>
              Account
            </p>
          )}
        </div>
      </nav>
      <div
        className={`${styles.upgradeBanner} ${
          auth.bannerOpen ? styles.active : ""
        }`}
      >
        <p className={styles.bannerTitle}>You Are Out Of Free Generations!</p>
        <p onClick={() => nav("/#pricing")} className={styles.bannerCta}>
          Upgrade Your Plan
        </p>

        <FontAwesomeIcon
          icon={faX}
          className={styles.bannerClose}
          onClick={() => auth.setBannerOpen(false)}
        />
      </div>
    </div>
  );
};
