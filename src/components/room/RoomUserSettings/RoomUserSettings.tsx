import { PlusIcon } from "@heroicons/react/24/outline";
import { TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  convertRoleToPrivilages,
  convertUserRoleToLabel,
  RoomUserExtended,
  UserRole,
} from "../../../types/Room";
import { ListFriendsResponse, UserInfo } from "../../../types/User";
import { callAPI } from "../../../utils/apiService";
import Divider from "../../common/Dividers/Dividers";
import Spinner from "../../common/Loading/Spinner/Spinner";
import SearchField from "../../common/Search/SearchField/SearchField";
import SettingsStep from "../SettingsStep/SettingsStep";
import styles from "./RoomUserSettings.module.css";

type RoomUserSettingsProps = {
  users: RoomUserExtended[];
  addUser: (user: RoomUserExtended) => void;
  deleteUser: (userId: string) => void;
  changeRole: (userId: string, role: UserRole) => void;
};

const RoomUserSettings: React.FC<RoomUserSettingsProps> = ({
  users,
  addUser,
  deleteUser,
  changeRole,
}) => {
  const [filteredFriends, setFilteredFriends] = useState<Array<UserInfo>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<RoomUserExtended | null>(
    null,
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

  const { data, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: () => callAPI<ListFriendsResponse>(`/users/friends`, "GET"),
  });

  useEffect(() => {
    if (data) {
      setFilteredFriends(
        data.filter((user) => !users.map((u) => u.userId).includes(user._id)),
      );
    }
  }, [data, users]);

  const handleUserClick = (user: RoomUserExtended) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
  };

  const handleRoleClick = (role: UserRole) => {
    if (selectedUser) {
      changeRole(selectedUser.userId, role);
    }
    setSelectedRole(role);
  };

  const handleAddClick = (userInfo: UserInfo) => {
    addUser({
      userId: userInfo._id,
      role: selectedRole,
      privilages: convertRoleToPrivilages[selectedRole],
      username: userInfo.username,
    });
    setSearchTerm("");
    setSelectedUser(null);
  };

  if (error) return null;
  if (isLoading || data === undefined) return <Spinner />;

  return (
    <SettingsStep title="User Settings">
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.searchContainer}>
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Friends"
            />
            <Divider thickness="1px" color="rgba(var(--base-light), 0.3)" />
            <div className={styles.friendList}>
              {filteredFriends.length > 0 &&
                filteredFriends.map((user) => (
                  <div key={user._id} className={`${styles.userDisplay}`}>
                    <span>{user.username}</span>
                    <PlusIcon
                      className={styles.plusIcon}
                      onClick={() => handleAddClick(user)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className={styles.selectedUsers}>
            {users.map((user, index) => (
              <motion.div
                key={index}
                className={`${styles.invitedUser} ${selectedUser?.userId === user.userId ? styles.selected : ""}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                onClick={() => handleUserClick(user)}
              >
                <div className={styles.userIcon}>
                  <UserIcon />
                </div>
                <div className={styles.textContainer}>
                  <p>
                    {
                      data.find((friend) => friend._id === user.userId)
                        ?.username
                    }
                  </p>
                  <p className={styles.role}>
                    {convertUserRoleToLabel[user.role]}
                  </p>
                </div>

                <button
                  className={styles.delete}
                  onClick={() => deleteUser(user.userId)}
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.roleContainer}>
            <p>Give the user a role</p>
            <div className={styles.roleList}>
              {userRoles.map((role) => (
                <button
                  key={role.role}
                  onClick={() => handleRoleClick(role.role)}
                  className={`${styles.userDisplay} ${
                    role.role === selectedRole ? styles.selected : ""
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SettingsStep>
  );
};

const userRoles = [
  { role: UserRole.ADMIN, label: "Admin" },
  { role: UserRole.CONTRIBUTOR, label: "Contributor" },
  { role: UserRole.USER, label: "User" },
  { role: UserRole.VIEW_ONLY, label: "Viewer" },
];

export default RoomUserSettings;
