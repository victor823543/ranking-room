import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./RoomsHeader.module.css";

type RoomsHeaderProps = {
  numberOfRooms: number;
};

const RoomsHeader: React.FC<RoomsHeaderProps> = ({ numberOfRooms }) => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs items={[{ name: "Rooms", href: "/rooms" }]} />
          <Divider margin="1rem" color="rgb(var(--base))" />
        </div>
        <Header center={false} as="h1">
          Rooms
        </Header>
        <Header center={false} as="h2" variant="secondary"></Header>
        <p className={styles.p}>{`Number of rooms: ${numberOfRooms}`}</p>
      </div>
      <div className={styles.rightContainer}></div>
    </div>
  );
};

export default RoomsHeader;
