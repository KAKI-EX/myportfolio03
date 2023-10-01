import { UserInputParams } from "interfaces";
import { useMessage } from "hooks/useToast";
import { AxiosError } from "axios";
import React from "react";
import { accountConfirmation } from "lib/api/auth";
import { UseFormSetValue } from "react-hook-form";

type Props = {
  setValue: UseFormSetValue<UserInputParams>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useAccountConfirmation = (props: Props) => {
  const { showMessage } = useMessage();
  const { setValue, setLoading } = props;
  const accountConfirmationSetting = async () => {
    try {
      setLoading(true);
      const acRes = await accountConfirmation();
      setValue("name", acRes.data.data.name);
      setValue("nickname", acRes.data.data.nickname);
      setValue("email", acRes.data.data.email);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError;
      // eslint-disable-next-line no-console
      console.error(axiosError.response);
      showMessage({ title: "エラーが発生しました。", status: "error" });
    }
  };
  return accountConfirmationSetting;
};
