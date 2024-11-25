import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleSvg from "../../../assets/svgs/GoogleSvg";
import { useAuth } from "../../../provider/authProvider";
import { callAPI } from "../../../utils/apiService";
import CustomizableButton from "../../common/Buttons/CustomizableButton";
import styles from "./GoogleLoginButton.module.css";

const GoogleLoginButton: React.FC = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (googleToken: string) =>
      callAPI<{ token: string }>("/auth/google-login", "POST", {
        token: googleToken,
      }),
    onSuccess: async (response) => {
      setToken(response.token);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleGoogleLoginSuccess = (response: any) => {
    const googleToken = response.access_token;
    mutation.mutate(googleToken);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: () => console.log("Login Failed"),
  });

  return (
    <CustomizableButton
      onClick={(e) => {
        e.preventDefault(), login();
      }}
      width="full"
      variant="opaque"
      style={{ position: "relative" }}
    >
      <div className={styles.icon}>
        {/* <img src={googleIcon} alt="google logo" /> */}
        <GoogleSvg color="white" />
      </div>
      Continue with Google
    </CustomizableButton>
  );
};

export default GoogleLoginButton;
