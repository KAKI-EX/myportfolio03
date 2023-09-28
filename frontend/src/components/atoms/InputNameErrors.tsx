import { Box } from "@chakra-ui/react";
import { SignUpParams } from "interfaces";
import { memo, VFC } from "react";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<SignUpParams>;
};

export const InputNameErrors: VFC<Props> = memo((props) => {
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
});
