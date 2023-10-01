import { UserInputParams } from "interfaces";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";
import { getNickname } from "lib/api/auth";

type Props = {
  setNickname: React.Dispatch<React.SetStateAction<UserInputParams | undefined>>;
  isMounted: React.MutableRefObject<boolean>;
};

export const useGetNickname = (props: Props) => {
  const { setNickname, isMounted } = props;
  const { showMessage } = useMessage();

  const fetchNickname = async () => {
    try {
      const nicknameRes = await getNickname();
      if (isMounted.current) {
        setNickname(nicknameRes.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: axiosError.response?.data.error, status: "error" });
    }
  };

  return fetchNickname;
};
