import {
  faFolderOpen,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Dashboard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Nav } from "../../components/Nav/Nav";

export const Dashboard = () => {
  return (
    <div>
      <Nav />

      <div>
        <h2 className={styles.dashboardTitle}>Dashboard</h2>
      </div>

      <div className={styles.searchAlign}>
        <div className={styles.searchWrapper}>
          <FontAwesomeIcon
            className={styles.searchIcon}
            icon={faMagnifyingGlass}
          />
          <input
            placeholder="Search for classes"
            className={styles.searchInput}
          />
        </div>
      </div>

      <FontAwesomeIcon icon={faFolderOpen} />
    </div>
  );
};
