import { Checkbox, HStack, Icon, Text } from "@chakra-ui/react";
import { ListFormParams, MergeParams } from "interfaces";
import React, { memo, VFC } from "react";
import { UseFormRegister } from "react-hook-form";
import { TbAlertTriangle } from "react-icons/tb";
import { useDateConversion } from "hooks/useDateConversion";
import { BsCartCheck } from "react-icons/bs";

type Props = {
  alertLists: ListFormParams[] | undefined;
  clickAlertDelete: boolean;
  register: UseFormRegister<MergeParams>;
  onClickAlertListBody: (listId: string | undefined, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const OkaimonoAlertList: VFC<Props> = memo((props) => {
  const { alertLists, clickAlertDelete, register, onClickAlertListBody } = props;
  const { dateConversion } = useDateConversion();

  return (
    <>
      {alertLists?.map((alert, index) => (
        <HStack w="100%" bg="white" py={4} px={2} rounded={10} boxShadow="md" key={alert.id}>
          {clickAlertDelete ? (
            <Checkbox size="lg" colorScheme="green" ml={1} {...register(`listForm.${index}.isDelete`)} />
          ) : null}
          <Text
            w="18%"
            color={
              (alert.differentDay !== undefined && alert.differentDay > 0 && "red.500") ||
              (alert.differentDay !== undefined && alert.differentDay > -3 && "yellow.500") ||
              "green.500"
            }
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
            onClick={(event) => onClickAlertListBody(alert.id, event)}
          >
            {alert.differentDay !== undefined && alert.differentDay > 0 && (
              <Icon
                as={TbAlertTriangle}
                w={6}
                h={6}
                mb={-2}
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              />
            )}
            {`${alert.differentDay}日`}
          </Text>
          <Text
            w="40%"
            fontSize={{ base: "sm", md: "md" }}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            onClick={(event) => onClickAlertListBody(alert.id, event)}
          >
            {alert.purchaseName}
          </Text>
          <Text
            w="40%"
            fontSize={{ base: "sm", md: "md" }}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            onClick={(event) => onClickAlertListBody(alert.id, event)}
          >
            <Icon as={BsCartCheck} w={5} h={5} mb={-1} mr={1} />
            {dateConversion(alert.shoppingDate)}
          </Text>
        </HStack>
      ))}
    </>
  );
});
