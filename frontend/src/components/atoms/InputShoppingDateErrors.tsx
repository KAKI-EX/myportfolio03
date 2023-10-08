import { Box } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<MergeParams>;
};

export function InputShoppingDateErrors(props: Props) {
  const { errors } = props;
  return (
    <>{errors.shoppingDate && errors.shoppingDate.message && <Box color="red">{errors.shoppingDate.message}</Box>}</>
  );
}
