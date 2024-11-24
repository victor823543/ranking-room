import styles from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerCircle}></div>
    </div>
  );
};

export default Spinner;
