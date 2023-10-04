import { Box } from "@chakra-ui/react";
import { SignInParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<SignInParams>;
};

export function InputEmailAddressErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.email && (
        <>
          {errors.email.types?.pattern && <Box color="red">{errors.email.types.pattern}</Box>}
          {errors.email.types?.required && <Box color="red">{errors.email.types.required}</Box>}
        </>
      )}
    </>
  );
}
