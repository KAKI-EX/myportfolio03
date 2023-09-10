import { render, RenderResult } from "@testing-library/react";
import { InputAmount } from "components/atoms/InputAmount";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

describe("InputAmount", () => {


  describe("readOnlyがfalseのとき", () => {
    let utils: RenderResult;
    const readOnlyFlag = false
    const mockFunctions = {
      readOnly: readOnlyFlag,
      register: jest.fn(),
      index: 0,
      validationNumber: /^[0-9]+$/,
    };
    beforeEach(() => {
      utils = render(
        <ChakraProvider>
          <InputAmount {...mockFunctions} />
        </ChakraProvider>
      );
    });

    test("placeholderが表示されること", () => {
      const placeholder = utils.getByPlaceholderText("個数");
      expect(placeholder).toBeInTheDocument();
    });

    test("backgroundcolorがwhiteであること", async () => {
      const input = await utils.getByTestId("inputAmount");
      const { debug } = utils;
      debug()
      expect(input).toHaveStyle({backgroundColor: "white"});
    });
  });

  describe("readOnlyがtrueのとき", () => {
    let utils: RenderResult;
    const readOnlyFlag = true
    const mockFunctions = {
      readOnly: readOnlyFlag,
      register: jest.fn(),
      index: 0,
      validationNumber: /^[0-9]+$/,
    };
    beforeEach(async () => {
      utils = await render(
        <ChakraProvider>
          <InputAmount {...mockFunctions} />;
        </ChakraProvider>
      );
    });

    test("placeholderが表示されないこと", () => {
      const placeholder = utils.queryByPlaceholderText("個数");
      expect(placeholder).not.toBeInTheDocument();
    });

    test("backgroundcolorが灰色であること", async () => {
      const input = await utils.getByTestId("inputAmount");
      expect(input).not.toHaveStyleRule('background-color', 'white');
    });
  });
});
