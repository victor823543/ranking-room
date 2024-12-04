import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRoomFilter, { ToggleFilterProps } from "../../../hooks/useRoomFilter";
import { useAuth } from "../../../provider/authProvider";
import {
  ListRoomsResponse,
  RankingSystem,
  UserRole,
} from "../../../types/Room";
import { formatDate } from "../../../utils/functions/dateFunctions";
import { to1Dec } from "../../../utils/functions/numberFunctions";
import Divider from "../../common/Dividers/Dividers";
import { StaticCircularProgress } from "../../common/Progress/CircularProgress/CircularProgress";
import SearchField from "../../common/Search/SearchField/SearchField";
import styles from "./RoomList.module.css";

type RoomListProps = {
  rooms: ListRoomsResponse;
};

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showFilter, setShowFilter] = useState(false);
  const { filteredRooms, searchTerm, handleInputChange, filter, toggleFilter } =
    useRoomFilter({ rooms });

  return (
    <div className={styles.container}>
      {/* Search */}
      <SearchField
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for Rooms"
      />

      {/* Filtering */}
      <div className={styles.filterWrapper}>
        <Divider thickness="1px" color="rgba(var(--base-light), 0.3)" />
        {
          <motion.div
            className={styles.filterContainer}
            initial={{ height: "0rem" }}
            animate={showFilter ? { height: "9rem" } : { height: "0rem" }}
          >
            {showFilter &&
              filtering.map((filterType, index) => (
                <motion.div
                  key={filterType.label}
                  className={styles.filterType}
                  variants={filterTypeVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <p>{filterType.label}</p>
                  <motion.div
                    className={styles.filterOptions}
                    variants={filterOptionsVariants}
                  >
                    {filterType.options.map((option) => (
                      <motion.button
                        variants={filterBtnVariants}
                        key={option.label}
                        className={
                          filter[filterType.type] === option.value
                            ? styles.activeFilter
                            : ""
                        }
                        onClick={() =>
                          toggleFilter({
                            type: filterType.type,
                            value: option.value,
                          } as ToggleFilterProps)
                        }
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              ))}
          </motion.div>
        }
        <motion.button
          layout
          className={styles.filterBtn}
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter <ChevronDownIcon />
        </motion.button>
      </div>

      {/* Room List */}
      <div className={styles.roomList}>
        {filteredRooms.map((room) => {
          // Total objects in the room
          const totalObjects = room.objects.length;
          // Total objects ranked by the user
          const totalRankedObjects = room.objects.filter((o) =>
            o.ranking.find((r) => r.user === user?._id),
          ).length;
          // Progress fraction
          const progress = totalRankedObjects / totalObjects;

          return (
            <div
              key={room.id}
              className={styles.roomDisplay}
              onClick={() => navigate(`/rooms/${room.id}`)}
            >
              <div className={styles.infoText}>
                <div className={styles.topPart}>
                  <p className={styles.name}>{room.name}</p>
                  <p className={styles.date}>
                    Created at {formatDate(room.timestamp, "clean")}
                  </p>
                </div>
                <div className={styles.bottomPart}>
                  <p>Ranking System: {room.rankingSystem}</p>
                  <p>Total Users: {room.users.length}</p>
                </div>
              </div>
              <div className={styles.progressWrapper}>
                <StaticCircularProgress
                  pathLength={progress}
                  size={80}
                  strokeWidth={5}
                  color="rgb(var(--primary))"
                  backgroundColor="rgba(var(--base-light), 0.3)"
                >
                  {to1Dec(progress * 100)}%
                </StaticCircularProgress>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Animation Variants
const filterTypeVariants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.2 + index * 0.2,
      when: "beforeChildren",
    },
  }),
};

const filterOptionsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const filterBtnVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Filtering Options
const filtering: Array<
  | {
      type: "system";
      label: string;
      options: { value: RankingSystem; label: string }[];
    }
  | {
      type: "role";
      label: string;
      options: { value: UserRole; label: string }[];
    }
> = [
  {
    type: "system",
    label: "Ranking System",
    options: [
      {
        value: RankingSystem.RANK,
        label: "Rank",
      },
      {
        value: RankingSystem.POINTS,
        label: "Points",
      },
      {
        value: RankingSystem.TIER,
        label: "Tier",
      },
    ],
  },
  {
    type: "role",
    label: "User Role",
    options: [
      {
        value: UserRole.ADMIN,
        label: "Admin",
      },
      {
        value: UserRole.CONTRIBUTOR,
        label: "Contributor",
      },
      {
        value: UserRole.USER,
        label: "User",
      },
      {
        value: UserRole.VIEW_ONLY,
        label: "Guest",
      },
    ],
  },
];

export default RoomList;
