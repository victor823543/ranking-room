import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./SocialHeader.module.css";

type SocialHeaderProps = {
  numberOfFriends: number;
};

const SocialHeader: React.FC<SocialHeaderProps> = ({ numberOfFriends }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs items={[{ name: "Social", href: "/social" }]} />
          <Divider margin="1rem" color="rgb(var(--base))" />
        </div>
        <Header center={false} as="h1">
          Social
        </Header>
        <Header center={false} as="h2" variant="secondary"></Header>
        <p className={styles.p}>{`Number of friends: ${numberOfFriends}`}</p>
      </div>
      <div className={styles.rightContainer}></div>
    </div>
  );
};

export default SocialHeader;
