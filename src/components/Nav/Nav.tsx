import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.scss";
import { useAuthContext } from "../../context/AuthContext/AuthContext";

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
            Log In
          </p>
        )}

        {auth.session && (
          <p className={styles.navItem} onClick={handleSignout}>
            Log Out
          </p>
        )}
      </div>
    </nav>
  );
};
