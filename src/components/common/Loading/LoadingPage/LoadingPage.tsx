import Layout from "../../../layout/Layout/Layout";
import Spinner from "../Spinner/Spinner";
import styles from "./LoadingPage.module.css";

type LoadingPageProps = {
  name: string;
};

const LoadingPage: React.FC<LoadingPageProps> = ({ name }) => {
  return (
    <Layout name={name}>
      <div className={styles.container}>
        <Spinner />
      </div>
    </Layout>
  );
};

export default LoadingPage;
