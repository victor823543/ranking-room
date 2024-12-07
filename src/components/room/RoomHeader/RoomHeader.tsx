import { Cog6ToothIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import PinSvg from "../../../assets/svgs/PinSvg";
import UnpinSvg from "../../../assets/svgs/UnpinSvg";
import { Alert, WarningAlert } from "../../../hooks/useAlerts";
import {
  convertRankingSystemToLabel,
  convertUserRoleToLabel,
  RankingSystem,
  UserRole,
} from "../../../types/Room";
import { callAPI } from "../../../utils/apiService";
import Breadcrumbs from "../../common/Breadcrumbs/Breadcrumbs";
import Divider from "../../common/Dividers/Dividers";
import { Header } from "../../common/Headers/Headers";
import styles from "./RoomHeader.module.css";

type RoomHeaderProps = {
  id: string;
  name: string;
  rankingSystem: RankingSystem;
  userRole: UserRole;
  isPinned: boolean;
  isLiked: boolean;
  hasEditPermission: boolean;
  pushAlert: (alert: Alert) => void;
};

const RoomHeader: React.FC<RoomHeaderProps> = ({
  id,
  name,
  rankingSystem,
  userRole,
  isPinned,
  isLiked,
  hasEditPermission,
  pushAlert,
}) => {
  const queryClient = useQueryClient();
  const pinMutation = useMutation({
    mutationFn: (id: string) => callAPI(`/rooms/${id}/pin`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const likeMutation = useMutation({
    mutationFn: (id: string) => callAPI(`/rooms/${id}/like`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const navigate = useNavigate();

  const handleSettingsClick = () => {
    if (hasEditPermission) {
      navigate("settings");
    } else {
      pushAlert(
        new WarningAlert("You don't have permission to edit this room"),
      );
    }
  };

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
        <p
          className={styles.p}
        >{`Your role: ${convertUserRoleToLabel[userRole]}`}</p>
      </div>
      <div className={styles.rightContainer}>
        <button className={styles.settingsBtn}>
          <Cog6ToothIcon onClick={handleSettingsClick} />
        </button>
        <button
          className={styles.settingsBtn}
          onClick={() => pinMutation.mutate(id)}
        >
          {isPinned ? <UnpinSvg /> : <PinSvg />}
        </button>
        <button
          className={`${styles.settingsBtn} ${isLiked ? styles.liked : styles.notLiked}`}
          onClick={() => likeMutation.mutate(id)}
        >
          {isLiked ? <HeartIcon /> : <HeartIcon />}
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;
