import { Box } from "@chakra-ui/react";
import { SignInParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<SignInParams>;
};

export const InputPasswordWithButtonErrors: VFC<Props> = memo((props) => {
  const { errors } = props;
  return (
    <>
      {errors.password && (
        <>
          {errors.password?.types?.required && <Box color="red">{errors.password.types.required}</Box>}
          {errors.password?.types?.minLength && <Box color="red">{errors.password.types.minLength}</Box>}
          {errors.password?.types?.maxLength && <Box color="red">{errors.password.types.maxLength}</Box>}
        </>
      )}
    </>
  );
});
