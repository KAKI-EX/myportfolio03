import client from "lib/api/client";
import Cookies from "js-cookie";

import { SignUpParams, SignInParams } from "interfaces/index";

// サインアップ（新規アカウント作成）
export const signUp = (params: SignUpParams) => {
  return client.post("auth", params);
};

// サインイン（ログイン）
export const signIn = (params: SignInParams) => {
  return client.post("auth/sign_in", params, {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  });
};

// ゲストログイン
export const guestSignIn = () => {
  return client.post(
    "auth/sessions/guest_sign_in",
    {},
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      },
    }
  );
};

// アカウントアップデート
export const accountUpdate = (params: SignUpParams) => {
  return client.put(
    "auth",
    { registration: params },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      },
    }
  );
};

// アカウント削除
export const accountDestroy = () => {
  return client.delete("auth", {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// アカウント情報の確認
export const accountConfirmation = () => {
  return client.get("auth/validate_token", {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// サインアウト（ログアウト）
export const signOut = () => {
  return client.delete("auth/sign_out", {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};

// 認証済みのユーザーを取得
// もしcookieの中に_access_token、_client、_uidがなかったらreturnで処理を抜け
// 存在する場合はそれぞれの値を持つ。
export const getCurrentUser = () => {
  if (!Cookies.get("_access_token") || !Cookies.get("_client") || !Cookies.get("_uid")) {
    return undefined;
  }
  return client.get("/auth/sessions_check", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });
};
