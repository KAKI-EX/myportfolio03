import { Box } from "@chakra-ui/react";
import { UserInputParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<UserInputParams>;
};

export const InputPasswordConfirmationWithoutButtonErrors: VFC<Props> = memo((props) => {
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
});
