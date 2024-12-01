import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  convertRankingSystemToLabel,
  RankingSystem,
  UserRole,
} from "../../../types/Room";
import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./RoomHeader.module.css";

type RoomHeaderProps = {
  id: string;
  name: string;
  rankingSystem: RankingSystem;
  userRole: UserRole;
};

const RoomHeader: React.FC<RoomHeaderProps> = ({
  id,
  name,
  rankingSystem,
  userRole,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.breadcrumbsContainer}>
          <Breadcrumbs
            items={[
              { name: "Rooms", href: "/rooms" },
              { name: name, href: `/rooms/${id}` },
            ]}
          />
          <Divider margin="1rem" color="rgb(var(--base))" />
        </div>
        <Header center={false} as="h1">
          {name}
        </Header>
        <Header center={false} as="h2" variant="secondary">
          {convertRankingSystemToLabel[rankingSystem]}
        </Header>
        <p className={styles.p}>{`Your role: ${userRole}`}</p>
      </div>
      <div className={styles.rightContainer}>
        <button className={styles.settingsBtn}>
          <Cog6ToothIcon onClick={() => navigate("settings")} />
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;
