import { fireEvent, render, RenderResult } from "@testing-library/react";
import { DeleteConfimationDialog } from "components/molecules/DeleteConfimationDialog";
import React from "react";

describe("DeleteConfimationDialog", () => {
  const onCloseAlertMock = jest.fn();
  const onClickDeleteMock = jest.fn();
  const dummyData = {
    createdAt: "2023-07-25",
    shoppingDate: "2023-07-25",
    estimatedBudget: "9999",
    id: "999",
    memosCount: 99,
    shopId: "999",
    shoppingMemo: "test",
    totalBudget: "9999",
    updatedAt: "2023-07-25",
    isOpen: false,
    isFinish: null,
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(
      <DeleteConfimationDialog
        onCloseAlert={onCloseAlertMock}
        isAlertOpen={true}
        cancelRef={React.createRef()}
        deletePost={dummyData}
        onClickDelete={onClickDeleteMock}
      />
    );
  });

  test("正しい文字列が表示されていること", async () => {
    const headerRe = /2023年7月25日.*のメモを削除しますか？/s;
    expect(await utils.findByText(headerRe)).toBeInTheDocument();
  });

  test("「やっぱりやめる」をクリックしたとき、onCloseAlertMockが呼び出されること", async () => {
    fireEvent.click(await utils.findByText("やっぱりやめる"));
    expect(onCloseAlertMock).toHaveBeenCalled();
  });

  test("「削除する」をクリックしたとき、onClickDeleteMockが呼び出されること", async () => {
    fireEvent.click(await utils.findByText("削除する"));
    expect(onClickDeleteMock).toHaveBeenCalled();
  });
});
