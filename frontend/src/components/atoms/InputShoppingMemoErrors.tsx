import { Box } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<MergeParams>;
};

export function InputShoppingMemoErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.shoppingMemo && errors.shoppingMemo.types?.maxLength && (
        <Box color="red">{errors.shoppingMemo.types.maxLength}</Box>
      )}
    </>
  );
}
