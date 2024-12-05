import React from "react";
import { useNavigate } from "react-router-dom";
import PinSvg from "../../../assets/svgs/PinSvg";
import {
  convertRankingSystemToLabel,
  ListRoomsResponse,
} from "../../../types/Room";
import { formatDate } from "../../../utils/functions/dateFunctions";
import HoverInfoArrowButton from "../../common/Buttons/HoverInfoArrowButton/HoverInfoArrowButton";
import styles from "./PinnedRoom.module.css";

type PinnedRoomProps = {
  room: ListRoomsResponse[0] | null;
};

const PinnedRoom: React.FC<PinnedRoomProps> = ({ room }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <PinSvg />
        </div>
        <h3 className={styles.h3}>Pinned Room</h3>
      </div>
      {!room && (
        <div className={styles.noRoom}>
          <p>No room pinned</p>
        </div>
      )}
      {room && (
        <div className={styles.room}>
          <HoverInfoArrowButton
            onClick={() => navigate(`/rooms/${room.id}`)}
            info={[
              {
                label: "Created At",
                info: formatDate(room.timestamp, "clean"),
              },
              {
                label: "Ranking System",
                info: convertRankingSystemToLabel[room.rankingSystem],
              },
              { label: "Total Users", info: room.users.length.toString() },
            ]}
          >
            {room.name}
          </HoverInfoArrowButton>
        </div>
      )}
    </div>
  );
};

export default PinnedRoom;
