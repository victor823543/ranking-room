import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListRoomsResponse, UserPrivilage } from "../../../types/Room";
import { User } from "../../../types/User";
import { to1Dec } from "../../../utils/functions/numberFunctions";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import { StaticCircularProgress } from "../../common/Progress/CircularProgress/CircularProgress";
import styles from "./AwaitsAction.module.css";

type AwaitsActionProps = {
  rooms: ListRoomsResponse;
  user: User;
};

const AwaitsAction: React.FC<AwaitsActionProps> = ({ rooms, user }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const roomsAwaitingAction = useMemo(
    () => getRoomsWithAwaitingAction(rooms, user._id),
    [rooms, user._id],
  );

  const selectedRoom = useMemo(
    () => roomsAwaitingAction[selected],
    [roomsAwaitingAction, selected],
  );

  const progress = useMemo(() => {
    if (roomsAwaitingAction.length === 0) return 0;
    const totalObjects = selectedRoom.objects.length;
    const totalRankedObjects = selectedRoom.objects.filter((o) =>
      o.ranking.find((r) => r.user === user._id),
    ).length;
    return totalRankedObjects / totalObjects;
  }, [roomsAwaitingAction, selectedRoom, user._id]);

  const handleNext = () => {
    setSelected((prev) => (prev + 1) % roomsAwaitingAction.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <PencilSquareIcon />
          </div>
          <h3 className={styles.h3}>Objects to rank</h3>
        </div>
        {roomsAwaitingAction.length === 0 && (
          <div className={styles.noRoom}>
            <p>No rooms awaiting action</p>
          </div>
        )}
        {roomsAwaitingAction.length > 0 && (
          <div className={styles.room}>
            <div className={styles.name}>
              <Link to={`/rooms/${selectedRoom.id}`}>
                {roomsAwaitingAction[selected].name}
              </Link>
            </div>

            <div className={styles.roomInfo}>
              <p>Ranking System: {selectedRoom.rankingSystem}</p>
              <p>Total Users: {selectedRoom.users.length}</p>
            </div>
            <CustomizableButton
              variant="primary"
              size="sm"
              onClick={() => navigate(`/rooms/${selectedRoom.id}/rank`)}
            >
              Rank
            </CustomizableButton>
          </div>
        )}
      </div>
      {roomsAwaitingAction.length > 0 && (
        <>
          <div className={styles.rightContainer}>
            <div className={styles.progressWrapper}>
              <StaticCircularProgress
                pathLength={progress}
                size={110}
                strokeWidth={6}
                color="rgb(var(--primary))"
                backgroundColor="rgba(var(--base-light), 0.3)"
              >
                {to1Dec(progress * 100)}%
              </StaticCircularProgress>
            </div>
          </div>
        </>
      )}
      {roomsAwaitingAction.length > 1 && (
        <div className={styles.showNextContainer}>
          <p>
            {selected + 1} / {roomsAwaitingAction.length}
          </p>
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

const getRoomsWithAwaitingAction = (
  rooms: ListRoomsResponse,
  userId: string,
) => {
  const roomsWithRankPermission: ListRoomsResponse = rooms.filter((room) => {
    const roomUser = room.users.find((u) => u.userId === userId);
    if (roomUser === undefined) return false;
    return roomUser.privilages.includes(UserPrivilage.RANK);
  });

  const roomsAwaitingAction = roomsWithRankPermission.filter((room) => {
    // Total objects in the room
    const totalObjects = room.objects.length;
    // Total objects ranked by the user
    const totalRankedObjects = room.objects.filter((o) =>
      o.ranking.find((r) => r.user === userId),
    ).length;

    return totalRankedObjects < totalObjects;
  });

  return roomsAwaitingAction.sort((a, b) => b.timestamp - a.timestamp);
};

export default AwaitsAction;
