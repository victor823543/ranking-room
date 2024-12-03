import { useNavigate } from "react-router-dom";
import BorderAnimationButton from "../../common/Buttons/BorderAnimationButton/BorderAnimationButton";
import styles from "./CreateNew.module.css";

const CreateNew = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <BorderAnimationButton onClick={() => navigate("/create")}>
        Create New
      </BorderAnimationButton>
    </div>
  );
};

export default CreateNew;
