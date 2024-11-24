import { useEffect, useState } from "react";
import { useAuth } from "../provider/authProvider";
import { ListRoomsResponse, RankingSystem, UserRole } from "../types/Room";

type UseRoomFilterProps = {
  rooms: ListRoomsResponse;
};

type Filter = {
  system: RankingSystem | null;
  role: UserRole | null;
};

export type ToggleFilterProps =
  | {
      type: "system";
      value: RankingSystem;
    }
  | {
      type: "role";
      value: UserRole;
    };

const useRoomFilter = ({ rooms }: UseRoomFilterProps) => {
  const { user } = useAuth();
  const [filteredRooms, setFilteredRooms] = useState<ListRoomsResponse>(rooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>({ system: null, role: null });

  useEffect(() => {
    let filtered = rooms;

    if (searchTerm) {
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filter.system) {
      filtered = filtered.filter(
        (room) => room.rankingSystem === filter.system,
      );
    }

    if (filter.role) {
      filtered = filtered.filter(
        (room) =>
          room.users.find((roomUser) => roomUser.userId === user?._id)?.role ===
          filter.role,
      );
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, filter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = (props: ToggleFilterProps) => {
    if (filter[props.type] === props.value) {
      setFilter({ ...filter, [props.type]: null });
    } else {
      setFilter({ ...filter, [props.type]: props.value });
    }
  };

  return {
    filteredRooms,
    searchTerm,
    handleInputChange,
    filter,
    toggleFilter,
  };
};

export default useRoomFilter;
