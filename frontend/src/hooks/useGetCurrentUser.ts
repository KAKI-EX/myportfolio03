import { AxiosError } from "axios";
import { User } from "interfaces";
import Cookies from "js-cookie";
import { getCurrentUser } from "lib/api/auth";
import React from "react";
import { useMessage } from "hooks/useToast";

type Props = {
  // eslint-disable-next-line no-unused-vars
  setIsSignedIn: (value: React.SetStateAction<boolean>) => void;
  // eslint-disable-next-line no-unused-vars
  setCurrentUser: (value: React.SetStateAction<User | undefined>) => void;
  // eslint-disable-next-line no-unused-vars
  setLoading: (value: React.SetStateAction<boolean>) => void;
};

export const useGetCurrentUser = (props: Props) => {
  const { showMessage } = useMessage();
  const { setIsSignedIn, setCurrentUser, setLoading } = props;

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      if (res?.data.isLogin === true) {
        const cookieData = {
          _access_token: res.headers["access-token"],
          _client: res.headers.client,
          _uid: res.headers.uid,
          _isLogin: res.data.isLogin,
        };
        Object.entries(cookieData).forEach(([key, value]) => Cookies.set(key, value));
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);
      }
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.error, status: "error" });
    }

    setLoading(false);
  };
  return { handleGetCurrentUser };
};
