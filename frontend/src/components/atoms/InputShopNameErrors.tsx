import { Box } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<MergeParams>;
};

export function InputShopNameErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.shopName && errors.shopName.types?.maxLength && <Box color="red">{errors.shopName.types.maxLength}</Box>}
    </>
  );
}
