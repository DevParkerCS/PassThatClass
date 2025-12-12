import { useEffect, useState } from "react";
import { Nav } from "../../components/Nav/Nav";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import styles from "./Account.module.scss";
import { Spinner } from "../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const authCtx = useAuthContext();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingTxt, setLoadingTxt] = useState("Loading Account...");

  useEffect(() => {
    if (!authCtx.loading && authCtx.profile) {
      setLoading(false);
    } else if (!authCtx.loading && !authCtx.session) {
      nav("/login");
    }
  }, [authCtx]);

  const handleLogout = async () => {
    try {
      setLoadingTxt("Logging Out...");
      setLoading(true);
      await authCtx.handleLogout();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Error loggin out");
    }
  };

  return (
    <div>
      <Nav />
      {loading || !authCtx.profile ? (
        <Spinner size="l" txt={loadingTxt} />
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>Account</h1>
          <div className={styles.contentWrapper}>
            <div className={styles.items}>
              <div className={styles.itemWrapper}>
                <p className={styles.itemTitle}>Subscription:</p>
                <p className={styles.itemValue}>{authCtx.profile.plan.name}</p>
                <button className={styles.itemCta}>Manage Subscription</button>
              </div>
              <div className={styles.itemWrapper}>
                <p className={styles.itemTitle}>Email:</p>
                <p className={styles.itemValue}>
                  {authCtx.session?.user.email}
                </p>
              </div>
              <div className={styles.itemWrapper}>
                <p className={styles.itemTitle}>Password:</p>
                <p className={styles.itemValue}>* * * * * * * * * *</p>
                <button className={styles.itemCta}>Update Password</button>
              </div>
              <div className={styles.itemWrapper}>
                <p className={styles.itemTitle}>Usage:</p>
                <p className={styles.itemValue}>
                  Remaining {authCtx.profile.generations_remaining_this_period}{" "}
                  / {authCtx.profile.plan.monthly_generation_limit} Generations
                </p>
              </div>
            </div>

            <div className={styles.acctCtas}>
              <button
                className={`${styles.acctCta} ${styles.logOut}`}
                onClick={handleLogout}
              >
                Log Out
              </button>
            </div>

            <div className={styles.acctCtas}>
              <p className={styles.dangerTitle}>Danger Zone</p>
              <p className={styles.dangerSub}>
                Deleting your account is irreversible.
              </p>
              <button className={`${styles.acctCta} ${styles.delete}`}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
