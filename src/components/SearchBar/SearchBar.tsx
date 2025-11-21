import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./SearchBar.module.scss";

type SearchBarProps = {
  p: string;
};

export const SearchBar = ({ p }: SearchBarProps) => {
  return (
    <div className={styles.searchWrapper}>
      <FontAwesomeIcon className={styles.searchIcon} icon={faMagnifyingGlass} />
      <input placeholder={p} className={styles.searchInput} />
    </div>
  );
};
