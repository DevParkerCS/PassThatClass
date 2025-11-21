import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.scss";

export const Nav = () => {
  const nav = useNavigate();
  return (
    <nav className={styles.navWrapper}>
      <div>
        <h1 className={styles.navTitle}>PassThatClass</h1>
      </div>

      <div className={styles.navItems}>
        <p className={styles.navItem}>Home</p>
        <p className={styles.navItem}>About</p>
        <p className={styles.navItem} onClick={() => nav("/dashboard")}>
          Dashboard
        </p>
      </div>
    </nav>
  );
};
