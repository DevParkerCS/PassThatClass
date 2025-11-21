import styles from "./Nav.module.scss";

export const Nav = () => {
  return (
    <nav className={styles.navWrapper}>
      <div>
        <h1 className={styles.navTitle}>PassThatClass</h1>
      </div>

      <div>
        <a className={styles.navItem}>Home</a>
        <a className={styles.navItem}>About</a>
        <a className={styles.navItem}>Dashboard</a>
      </div>
    </nav>
  );
};
