import { Box } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<UserInputParams>;
};

export function InputPasswordConfirmationWithoutButtonErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.passwordConfirmation && (
        <>
          {errors.passwordConfirmation.types?.validate && (
            <Box color="red">{errors.passwordConfirmation.types.validate}</Box>
          )}
          {errors.passwordConfirmation.types?.required && (
            <Box color="red">{errors.passwordConfirmation.types.required}</Box>
          )}
        </>
      )}
    </>
  );
}
