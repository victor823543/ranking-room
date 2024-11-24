import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import useCreateRoom from "./useCreateRoom";

const useLogout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearState } = useCreateRoom();

  const logout = () => {
    queryClient.clear();
    setToken(null);
    clearState();
    navigate("/");
  };

  return logout;
};

export default useLogout;
