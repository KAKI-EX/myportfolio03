import { fireEvent, render, RenderResult } from "@testing-library/react";
import { OkaimonoAlertModal } from "components/molecules/OkaimonoAlertModal";

describe("OkaimonoAlertModal", () => {
  const testPurchaseObj = {
    userId: "test1",
    shopId: "shopId",
    id: "1",
    purchaseName: "testPurchaseRed",
    price: "999",
    shoppingDetailMemo: "testMemo",
    amount: "amount",
    shoppingDate: "2023-07-27",
    expiryDateStart: "2023-07-28",
    expiryDateEnd: "2023-07-29",
    listId: "99",
    isBought: true,
    isFinish: true,
    differentDay: 1,
    isDelete: false,
    memosCount: 3,
    totalBudget: 9999,
  };

  const testShopObj = {
    createdAt: "2023-07-28",
    id: "shopId",
    shopMemo: "testMemoShop",
    shopName: "testShop",
    shoppingDataCount: "9",
    updatedAt: "2023-07-28",
  };

  const onClickCloseMock = jest.fn();
  const onCloseMock = jest.fn();
  const onClickShowMemoMock = jest.fn()

  const mockFunctions = {
    isOpen: true,
    onClose: onCloseMock,
    onClickShowMemo: onClickShowMemoMock,
    alertListDetail: testPurchaseObj,
    alertListShop: testShopObj,
    onClickClose: onClickCloseMock,
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(<OkaimonoAlertModal {...mockFunctions} />);
  });

  describe("modalが開いたとき", () => {
    test("データが正しく表示されていること", async () => {
      const shoppingDate = await utils.getByText("2023年7月27日");
      const expiryDateStart = await utils.getByText("2023年7月28日");
      const expiryDateEnd = await utils.getByText("2023年7月29日");
      const shopName = await utils.getByText("testShop");
      const price = await utils.getByText("999 円");
      const amount = await utils.getByText("amount つ");
      expect(price).toBeInTheDocument();
      expect(amount).toBeInTheDocument();
      expect(shopName).toBeInTheDocument();
      expect(shoppingDate).toBeInTheDocument();
      expect(expiryDateStart).toBeInTheDocument();
      expect(expiryDateEnd).toBeInTheDocument();
    });
  });

  describe("ボタンが押されたとき", () => {
    test("閉じるボタンの関数が実行されること", async () => {
      const closeButton = await utils.getByText("閉じる");
      fireEvent.click(closeButton);
      expect(onClickCloseMock);
    });

    test("閉じるボタン(バツマーク)の関数が実行されること", async () => {
      const closeButton = await utils.getByTestId("close-button");
      fireEvent.click(closeButton);
      expect(onCloseMock).toHaveBeenCalled();
    });

    test("実際のお買物メモを見るを押すと、適切な関数が実行されること", async () => {
      const showMemo = await utils.getByText("実際のお買い物メモを見る");
      fireEvent.click(showMemo);
      expect(onClickShowMemoMock).toHaveBeenCalled();
    });
  });
});
