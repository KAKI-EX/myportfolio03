import { ChakraProvider, StylesProvider, Table, Thead, Tr } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { TableThreadTitle } from "components/atoms/ThreadTitle";

describe("ThreadTitle", () => {
  test("childrenが表示されていること", () => {
    const { getByText } = render(
      <ChakraProvider>
        <Table>
          <Thead>
            <Tr>
              <TableThreadTitle
                p={0}
                color="white"
                bg="teal.500"
                w={{ base: "15%", md: "10%" }}
                borderBottom="1px"
                borderColor="gray.400"
                textAlign="center"
                fontSize={{ base: "sm", md: "md" }}
              >
                テストタイトル
              </TableThreadTitle>
            </Tr>
          </Thead>
        </Table>
      </ChakraProvider>
    );
    expect(getByText("テストタイトル")).toBeInTheDocument();
  });
});
