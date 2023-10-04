import { Box } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import { FieldErrors } from "react-hook-form";

type Props = {
  errors: FieldErrors<MergeParams>;
};

export function InputEstimatedBudgetErrors(props: Props) {
  const { errors } = props;
  return (
    <>
      {errors.estimatedBudget && errors.estimatedBudget.types?.pattern && (
        <Box color="red">{errors.estimatedBudget.types.pattern}</Box>
      )}
    </>
  );
}
