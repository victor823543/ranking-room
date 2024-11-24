import { Bars3Icon } from "@heroicons/react/24/outline";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navBarWrapper}>
      <button className={styles.menuBtn}>
        <Bars3Icon className={styles.menuIcon} />
      </button>
    </div>
  );
};

export default Navbar;
