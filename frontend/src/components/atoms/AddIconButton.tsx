import { SmallAddIcon } from "@chakra-ui/icons";
import { memo, VFC } from "react";

type Props = {
  readOnly?: boolean;
  // eslint-disable-next-line no-unused-vars
  insertInputForm: (index: number) => void;
  index: number;
};

export const AddIconButton: VFC<Props> = memo((props) => {
  const { readOnly, insertInputForm, index } = props;
  return (
    <SmallAddIcon
      bg="teal.500"
      rounded="full"
      color="white"
      onClick={(event) => {
        if (readOnly) {
          event.preventDefault();
          // eslint-disable-next-line no-alert
          alert("確認画面では使用できません。");
          return;
        }
        insertInputForm(index);
      }}
    />
  );
});
