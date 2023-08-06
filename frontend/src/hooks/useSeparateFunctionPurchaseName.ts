import React from "react";
import { UseFormRegister } from "react-hook-form";
import { ListFormParams, MergeParams } from "interfaces";

type Props = {
  register: UseFormRegister<MergeParams>;
  index: number;
  // eslint-disable-next-line no-unused-vars
  onListChange?: (event: React.ChangeEvent<HTMLInputElement>, index: number, newValue: string) => void;
  setPurchaseNameSuggestions?: React.Dispatch<React.SetStateAction<ListFormParams[]>>;
};

export const useSeparateFunctionPurchaseName = () => {
  const separeteFunction = (props: Props) => {
    const { register, index, onListChange, setPurchaseNameSuggestions } = props;
    const {
      ref,
      onChange: registerOnChange,
      ...rest
    } = register(`listForm.${index}.purchaseName`, {
      required: { value: true, message: "商品名が入力されていません" },
      maxLength: { value: 35, message: "最大文字数は35文字までです。" },
    });

    const customOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      // 親コンポーネントから渡された onChange ハンドラを実行
      if (onListChange) {
        onListChange(event, index, event.target.value);
      }

      // 入力が空の場合、候補リストをクリアする
      if (setPurchaseNameSuggestions && event.target.value === "") {
        setPurchaseNameSuggestions([]);
      }

      // React Hook Form の onChange ハンドラを実行
      if (registerOnChange) {
        registerOnChange(event);
      }
    };

    return {
      ref,
      onChange: customOnChange,
      ...rest,
    };
  };
  return separeteFunction;
};
