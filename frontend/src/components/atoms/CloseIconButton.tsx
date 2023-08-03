import { SmallCloseIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";
import { MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { UseFieldArrayRemove, UseFormGetValues } from "react-hook-form";

type Props = {
  readOnly: boolean;
  getValues?: UseFormGetValues<MergeParams>;
  index: number;
  setDeleteIds?: React.Dispatch<React.SetStateAction<string[]>> | undefined;
  remove: UseFieldArrayRemove;
};

export const CloseIconButton: VFC<Props> = memo((props) => {
  const { readOnly, getValues, index, setDeleteIds, remove } = props;
  return (
    <Icon
      as={SmallCloseIcon}
      bg="red.500"
      color="white"
      rounded="full"
      boxSize={4}
      onClick={() => {
        if (readOnly) {
          // eslint-disable-next-line no-alert
          alert("確認画面では使用できません。");
          return;
        }
        if (getValues) {
          const listId = getValues(`listForm.${index}.id`);
          if (listId) {
            if (setDeleteIds) {
              setDeleteIds((prevIds) => [...(prevIds || []), listId]);
            }
          }
        }
        remove(index);
      }}
    />
  );
});
