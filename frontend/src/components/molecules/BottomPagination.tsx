import { Box, Button } from "@chakra-ui/react";
import React, { memo, VFC } from "react";

type Props = {
  currentPage: number;
  searchCurrentPage: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  clickOnSearch: boolean;
  setSearchCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number | undefined;
};

export const BottomPagination: VFC<Props> = memo((props) => {
  const {
    currentPage,
    searchCurrentPage,
    setLoading,
    clickOnSearch,
    setSearchCurrentPage,
    setCurrentPage,
    totalPages,
  } = props;

  return (
    <Box>
      {!(currentPage === 1 && searchCurrentPage === 1) && (
        <Button
          onClick={() => {
            setLoading(true);
            if (clickOnSearch === true) {
              setSearchCurrentPage((prev) => Math.max(prev - 1, 1));
            } else {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }
          }}
        >
          前のページ
        </Button>
      )}

      {!(currentPage === totalPages || searchCurrentPage === totalPages) && (
        <Button
          onClick={() => {
            setLoading(true);
            if (clickOnSearch === true) {
              setSearchCurrentPage((prev) => prev + 1);
            } else {
              setCurrentPage((prev) => prev + 1);
            }
          }}
        >
          次のページ
        </Button>
      )}
    </Box>
  );
});
