import { fireEvent, render, RenderResult } from "@testing-library/react";
import { OkaimonoCheckOpenUrlModal } from "components/molecules/OkaimonoCheckOpenUrlModal";

describe("OkaimonoCheckOpenUrlModal", () => {
  const onCloseUrlMock = jest.fn();
  const onClickUrlCopyMock = jest.fn();

  const mockFunctions = {
    isOpenUrl: true,
    onCloseUrl: onCloseUrlMock,
    openMessage: "表示テスト",
    register: jest.fn(),
    onClickUrlCopy: onClickUrlCopyMock,
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(<OkaimonoCheckOpenUrlModal {...mockFunctions} />);
  });

  describe("modalを開いたとき", () => {
    test("openMessageが表示されていること", () => {
      const openMessage = utils.getByText("表示テスト");
      expect(openMessage).toBeInTheDocument();
    });
  });

  describe("ボタンが押されたとき", () => {
    test("onClickUrlCopyが実行されること", () => {
      const copyButton = utils.getByText("コピー");
      fireEvent.click(copyButton);
      expect(onClickUrlCopyMock).toHaveBeenCalled();
    });
    test("onCloseUrlMockが実行されること", () => {
      const closeButton = utils.getByText("閉じる");
      fireEvent.click(closeButton);
      expect(onCloseUrlMock).toHaveBeenCalled();
    });
    test("onCloseUrlMockが実行されること", () => {
      const modalCloseButton = utils.getByTestId("modalCloseButton");
      fireEvent.click(modalCloseButton);
      expect(onCloseUrlMock).toHaveBeenCalled();
    });
  });
});
