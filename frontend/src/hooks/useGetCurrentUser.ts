import { User } from "interfaces";
import Cookies from "js-cookie";
import { getCurrentUser } from "lib/api/auth";
import React from "react";

type Props = {
  setIsSignedIn: (value: React.SetStateAction<boolean>) => void;
  setCurrentUser: (value: React.SetStateAction<User | undefined>) => void;
  setLoading: (value: React.SetStateAction<boolean>) => void;
};

export const useGetCurrentUser = (props: Props) => {
  const { setIsSignedIn, setCurrentUser, setLoading } = props;

  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      console.log(res);
      if (res?.data.isLogin === true) {
        console.log(res);
        const cookieData = {
          _access_token: res.headers["access-token"],
          _client: res.headers.client,
          _uid: res.headers.uid,
          _isLogin: res.data.isLogin,
        };
        Object.entries(cookieData).map(([key, value]) => Cookies.set(key, value));
        console.log(document.cookie);
        setIsSignedIn(true);
        setCurrentUser(res?.data.data);

        console.log(res?.data.data);
      } else {
        console.log("No current user");
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };
  return { handleGetCurrentUser };
};
