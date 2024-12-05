import React from "react";
import { User } from "../../../types/User";
import { formatDate } from "../../../utils/functions/dateFunctions";
import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./DashboardHeader.module.css";

type DashboardHeaderProps = {
  user: User;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  console.log(user);
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbsContainer}>
        <Breadcrumbs items={[]} />
        <Divider margin="1rem" color="rgb(var(--base))" />
      </div>
      <Header center={false} as="h1">
        Welcome {user.username}
      </Header>
      <p className={styles.p}>{`Email address: ${user.email}`}</p>
      <p
        className={styles.p}
      >{`User since: ${formatDate(user.timestamp, "long")}`}</p>
    </div>
  );
};

export default DashboardHeader;
