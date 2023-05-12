import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "router/Router";
import theme from "components/theme/theme";
import { BrowserRouter, Redirect } from "react-router-dom";
import { User } from "interfaces";
import React, { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "lib/api/auth";
import Cookies from "js-cookie";

// グローバルで扱う変数・関数
// asで引数に対して型変換。
export const AuthContext = createContext(
  {} as {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);

// ---------------------------------------------------------------------------------

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
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
          _user_id: res.data.data.id,
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

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  // ---------------------------------------------------------------------------------

  // ユーザーが認証済みかどうかでルーティングを決定
  // 未認証だった場合は「/signin」ページに促す
  const Private = ({ children }: { children: React.ReactElement }) => { // eslint-disable-line
    if (!loading) {
      if (isSignedIn) {
        return children;
      } else {                                                          // eslint-disable-line
        return <Redirect to="/user/sign_in" />;
      }
    } else {                                                            // eslint-disable-line
      return <></>;                                                     // eslint-disable-line
    }
  };

  // ---------------------------------------------------------------------------------

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{                                                        // eslint-disable-line
          loading,
          setLoading,
          isSignedIn,
          setIsSignedIn,
          currentUser,
          setCurrentUser,
        }}
      >
        <ChakraProvider theme={theme}>
          {/* <Private> */}
          <Router />
          {/* </Private> */}
        </ChakraProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
