import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import styles from "./ToggleAppSearch.module.css";

type ToggleAppSearchProps = {
  onSearchClick: () => void;
};

const ToggleAppSearch: React.FC<ToggleAppSearchProps> = ({ onSearchClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <MagnifyingGlassIcon />
        </div>
        <h3 className={styles.h3}>Search</h3>
      </div>
      <div className={styles.main}>
        <button className={styles.searchButton} onClick={onSearchClick}>
          <MagnifyingGlassIcon />
        </button>
      </div>
    </div>
  );
};

export default ToggleAppSearch;
