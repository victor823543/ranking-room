import { TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useCreateRoom from "../../../hooks/useCreateRoom";
import {
  convertRoleToPrivilages,
  RoomUser,
  UserRole,
} from "../../../types/Room";
import { ListFriendsResponse, UserInfo } from "../../../types/User";
import { callAPI } from "../../../utils/apiService";
import { BackButton } from "../../common/Buttons/BackButton/BackButton";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import Divider from "../../common/Dividers/Dividers";
import Spinner from "../../common/Loading/Spinner/Spinner";
import SearchField from "../../common/Search/SearchField/SearchField";
import styles from "./UserStep.module.css";

const userRoles = [
  { role: UserRole.ADMIN, label: "Admin" },
  { role: UserRole.CONTRIBUTOR, label: "Contributor" },
  { role: UserRole.USER, label: "User" },
  { role: UserRole.VIEW_ONLY, label: "Viewer" },
];

const UserStep = () => {
  const { createRoom, previousStep, addUser, body, deleteUser } =
    useCreateRoom();

  //   Search functionality
  const [filteredFriends, setFilteredFriends] = useState<Array<UserInfo>>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

  const { data, isLoading, error } = useQuery({
    queryKey: ["friends"],
    queryFn: () => callAPI<ListFriendsResponse>(`/users/friends`, "GET"),
  });

  useEffect(() => {
    if (data) {
      setFilteredFriends(
        data.filter(
          (user) => !body.users?.map((u) => u.userId).includes(user._id),
        ),
      );
    }
  }, [data, body]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      const filtered = data?.filter(
        (user) =>
          user.username.toLowerCase().includes(e.target.value.toLowerCase()) &&
          !body.users?.map((u) => u.userId).includes(user._id),
      );
      setFilteredFriends(filtered || []);
    } else
      setFilteredFriends(
        data
          ? data.filter(
              (user) => !body.users?.map((u) => u.userId).includes(user._id),
            )
          : [],
      );
  };

  const handleSubmit = () => {
    if (!selectedUser) return;
    const data: RoomUser = {
      userId: selectedUser,
      role: selectedRole,
      privilages: convertRoleToPrivilages[selectedRole],
    };
    addUser(data);
    setSelectedUser(null);
    setSelectedRole(UserRole.USER);
  };

  if (error) return null;
  if (isLoading || data === undefined) return <Spinner />;

  return (
    <div className={styles.userStep}>
      <div className={styles.btnContainer}>
        <BackButton onClick={previousStep} />
      </div>
      <div className={styles.container}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={styles.form}
          >
            <div className={styles.searchContainer}>
              <SearchField
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search for Friends"
              />
              <Divider thickness="1px" color="rgba(var(--base-light), 0.3)" />
              <div className={styles.friendList}>
                {filteredFriends.length > 0 &&
                  filteredFriends.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => setSelectedUser(user._id)}
                      className={`${styles.userDisplay} ${user._id === selectedUser ? styles.selected : ""}`}
                    >
                      <span>{user.username}</span>
                    </div>
                  ))}
              </div>
            </div>
            <Divider thickness="1px" color="rgba(var(--base-light), 0.3)" />
            <div className={styles.roleContainer}>
              <p>Give the user a role</p>
              <div className={styles.roleList}>
                {userRoles.map((role) => (
                  <button
                    key={role.role}
                    onClick={() => setSelectedRole(role.role)}
                    className={`${styles.userDisplay} ${
                      role.role === selectedRole ? styles.selected : ""
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            <CustomizableButton
              variant="opaque"
              type="submit"
              onClick={handleSubmit}
            >
              Invite User
            </CustomizableButton>
          </motion.div>
        </div>
        <div>
          <div className={styles.userList}>
            {body?.users?.map((user, index) => (
              <motion.div
                key={index}
                className={styles.invitedUser}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
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
                    {userRoles.find((role) => role.role === user.role)?.label}
                  </p>
                </div>

                <button
                  className={styles.delete}
                  onClick={() => deleteUser(index)}
                >
                  <TrashIcon />
                </button>
              </motion.div>
            ))}
          </div>
          <motion.div
            className={`${styles.nextStep} ${body?.users && body.users.length > 0 ? styles.topBorder : ""}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p>You can always invite more people later...</p>
            <CustomizableButton variant="primary" onClick={createRoom}>
              Create Room
            </CustomizableButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserStep;
