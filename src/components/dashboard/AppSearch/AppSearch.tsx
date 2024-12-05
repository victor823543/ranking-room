import React, { useMemo } from "react";
import { ListRoomsResponse, Object } from "../../../types/Room";
import { formatDate } from "../../../utils/functions/dateFunctions";
import { ModalWrapperBlurToned } from "../../common/Modals/Modals";
import DropdownSearch, {
  SearchObject,
} from "../../common/Search/DropdownSearch/DropdownSearch";
import styles from "./AppSearch.module.css";

type AppSearchProps = {
  onWrapperClick: () => void;
  objects: Object[];
  rooms: ListRoomsResponse;
};

const AppSearch: React.FC<AppSearchProps> = ({
  onWrapperClick,
  objects,
  rooms,
}) => {
  const items = useMemo(
    () => createSearchItems(rooms, objects),
    [rooms, objects],
  );
  return (
    <ModalWrapperBlurToned onClick={onWrapperClick}>
      <div className={styles.search}>
        <DropdownSearch
          items={items}
          placeholder="Search for rooms and objects..."
        />
      </div>
    </ModalWrapperBlurToned>
  );
};

const createSearchItems = (
  rooms: ListRoomsResponse,
  objects: Object[],
): SearchObject[] => {
  const roomItems = rooms.map((room) => ({
    href: `/rooms/${room.id}`,
    title: room.name,
    description: `Created at ${formatDate(room.timestamp, "medium")}`,
  }));
  const objectItems = objects.map((object) => ({
    href: `/rooms/${object.room}?view-object=${object._id}`,
    title: object.name,
    description: `Object in room ${rooms.find((room) => room.id === object.room)?.name}`,
  }));
  return [...roomItems, ...objectItems];
};

export default AppSearch;
