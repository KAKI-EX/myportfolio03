import { Box } from "@chakra-ui/react";
import { SignUpParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<SignUpParams>;
};

export function InputNameErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.name && (
        <>
          {errors.name.types?.maxLength && <Box color="red">{errors.name.types.maxLength}</Box>}
          {errors.name.types?.required && <Box color="red">{errors.name.types.required}</Box>}
        </>
      )}
    </>
  );
}
