import Cookies from "js-cookie";
import { memo, VFC } from "react";

export const Home: VFC = memo(() => {
  console.log(document.cookie);
  return <p>{document.cookie}</p>;
});
