import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";

const options = {
  ignoreHeaders: true,
};

// applyCaseMiddlewareはキャメルケースをスネークケースにしてAPIへ送信してくれるが、リクエストの構造を変化させる。
// ■フロントエンド側でrequireキーを設定していない場合
// railsのparamsは{ "data1"=>a, "data2"=>b, require_key_name=>{ data1:a, data2:b } }のようになる。
// rails側で勝手にrequireキーが挿入された形で同じデータがネストされてしまう。
//
// ■フロントエンド側でrequireキーを設定している場合
// railsのparamsは{ require_key_name=>{"data1"=>a, "data2"=>b} }のように想定した通りの形になる。
//
// 勝手にrequestキーが変換されてしまうので、セキュリティ上問題が生じる可能性も考えられることから、一旦の対策として
// APIへリクエストボディを使用してデータを送信する際は、フロント側で明示的にrequireキーを設定することとする。

const client = applyCaseMiddleware(
  axios.create({
    // http://192.168.0.210:3001/api/v1が変更前のbaseURL。production環境に移行するために修正。https://web.okaimonoportfolio.xyz/api/v1, https://api.okaimonoportfolio.xyz.api/v1
    baseURL: `${process.env.REACT_APP_API_DOMEIN}/api/v1`
  }),
  options
);

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const poppedValue = parts.pop();
    if (poppedValue) {
      return poppedValue.split(";").shift();
    }
  }
}

client.interceptors.request.use(
  (config) => {
    const updatedConfig = { ...config };
    const accessToken = getCookie("_access_token");
    const uid = getCookie("_uid");
    const clientCookie = getCookie("_client");

    if (accessToken && uid && clientCookie) {
      updatedConfig.headers["access-token"] = accessToken;
      updatedConfig.headers.uid = uid;
      updatedConfig.headers.client = clientCookie;
    }

    return updatedConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
