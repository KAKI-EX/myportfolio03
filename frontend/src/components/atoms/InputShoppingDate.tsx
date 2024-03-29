import { Input } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { memo, useEffect, useState, VFC } from "react";
import { UseFormRegister } from "react-hook-form";

type Props = {
  readOnly?: boolean;
  register: UseFormRegister<MergeParams>;
  w?: string;
};

export const InputShoppingDate: VFC<Props> = memo((props) => {
  const { readOnly = false, register, w } = props;

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  const minDateString = today.toISOString().split("T")[0];
  const maxDateString = nextYear.toISOString().split("T")[0];
  console.log(minDateString);
  return (
    <Input
      _hover={readOnly ? undefined : { fontWeight: "bold", cursor: "pointer" }}
      isReadOnly={readOnly}
      bg={readOnly ? "blackAlpha.200" : "white"}
      size="md"
      type="date"
      w={w}
      fontSize={{ base: "sm", md: "md" }}
      {...register("shoppingDate", {
        validate: (value) => {
          if (!value) {
            return "日付は必須です。";
          }
          const year = value.split("-")[0]; // "YYYY-MM-DD" の形式から "YYYY" を取得
          if (year.length > 4) {
            return "年は4桁を超えることはできません。";
          }
        },
      })}
    />
  );
});
