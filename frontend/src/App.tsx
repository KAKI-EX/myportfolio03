import { ChakraProvider } from "@chakra-ui/react";
import { Router } from "router/Router";
import theme from "components/theme/theme";
import { BrowserRouter, Redirect } from "react-router-dom";
import { User } from "interfaces";
import React, { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useGetCurrentUser } from "hooks/useGetCurrentUser";
import { useMessage } from "hooks/useToast";

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

// ユーザーが認証済みかどうかでルーティングを決定
// 未認証だった場合は「/signin」ページに促す
export function Private({
  children,
  loading,
  isSignedIn,
}: {
  children: React.ReactElement;
  loading: boolean;
  isSignedIn: boolean;
}) {
  const { showMessage } = useMessage();
  const toastCount = useRef(0);

  if (!loading) {
    if (isSignedIn) {
      return children;
    }
    if (toastCount.current === 0) {
      showMessage({ title: "ログインが必要です。", status: "warning" });
      toastCount.current++;
    }
    return <Redirect to="/user/sign_in" />;
  }
  return null;
}

// ---------------------------------------------------------------------------------

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const props = { setIsSignedIn, setCurrentUser, setLoading };
  const { handleGetCurrentUser } = useGetCurrentUser(props);

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const value = useMemo(
    () => ({
      loading,
      setLoading,
      isSignedIn,
      setIsSignedIn,
      currentUser,
      setCurrentUser,
    }),
    [loading, isSignedIn, currentUser]
  );

  return (
    <BrowserRouter>
      <AuthContext.Provider value={value}>
        <ChakraProvider theme={theme}>
          <Router />
        </ChakraProvider>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
