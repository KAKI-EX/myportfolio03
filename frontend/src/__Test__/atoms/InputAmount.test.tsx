import { render, RenderResult } from "@testing-library/react";
import { InputAmount } from "components/atoms/InputAmount";
import { ChakraProvider } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";

describe("InputAmount", () => {
  let utils: RenderResult;

  // const mockFunctions = (readOnly: boolean) => {
  //   return {
  //     readOnly: readOnly,
  //     register: jest.fn(),
  //     index: 0,
  //     validationNumber: /^[0-9]+$/,
  //   };
  // };

  // beforeEach(() => {
  //   utils = render(<InputAmount {...mockFunctions} />);
  // });
  describe("readOnlyがfalseのとき", () => {
    beforeEach(() => {
      const mockFunctions = {
        readOnly: false,
        register: jest.fn(),
        index: 0,
        validationNumber: /^[0-9]+$/,
      };
      utils = render(<InputAmount {...mockFunctions} />);
    });

    test("placeholderが表示されること", () => {
      const placeholder = utils.getByPlaceholderText("個数");
      expect(placeholder).toBeInTheDocument();
    });

    test("backgroundcolorがwhiteであること", async () => {
      const input = await utils.getByTestId("inputAmount");
      const { debug } = utils;
      debug();
      expect(input).toHaveStyle("background-color: white");
    });
  });

  describe("readOnlyがtrueのとき", () => {
    beforeEach(async () => {
      const mockFunctions = {
        readOnly: true,
        register: jest.fn(),
        index: 0,
        validationNumber: /^[0-9]+$/,
      };
      utils = await render(<InputAmount {...mockFunctions} />);
    });

    test("placeholderが表示されないこと", () => {
      const placeholder = utils.queryByPlaceholderText("個数");
      expect(placeholder).not.toBeInTheDocument();
    });

    test("backgroundcolorが灰色であること", async () => {
      const input = await utils.getByTestId("inputAmount");
      // const { debug } = utils;
      // debug();
      expect(input).toHaveStyle({backgroundColor: "rgba(0, 0, 0, 0.08)"})
    });
  });
});
