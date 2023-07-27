import { getByText, prettyDOM, render, RenderResult } from "@testing-library/react";
import { OkaimonoAlertList } from "components/molecules/OkaimonoAlertList";

describe("OkaimonoAlertList", () => {
  const testAllay = [
    {
      userId: "test1",
      shopId: "shopId",
      id: "1",
      purchaseName: "testPurchaseRed",
      price: "999",
      shoppingDetailMemo: "testMemo",
      amount: "9",
      shoppingDate: "2023-07-27",
      expiryDateStart: "2023-07-27",
      expiryDateEnd: "2023-07-28",
      listId: "99",
      isBought: true,
      isFinish: true,
      differentDay: 1,
      isDelete: false,
      memosCount: 3,
      totalBudget: 9999,
    },
    {
      userId: "test1",
      shopId: "shopId",
      id: "2",
      purchaseName: "testPurchaseYellow",
      price: "999",
      shoppingDetailMemo: "testMemo",
      amount: "9",
      shoppingDate: "2023-07-27",
      expiryDateStart: "2023-07-27",
      expiryDateEnd: "2023-07-30",
      listId: "99",
      isBought: true,
      isFinish: true,
      differentDay: -3,
      isDelete: false,
      memosCount: 3,
      totalBudget: 9999,
    },
    {
      userId: "test1",
      shopId: "shopId",
      id: "3",
      purchaseName: "testPurchaseGreen",
      price: "999",
      shoppingDetailMemo: "testMemo",
      amount: "9",
      shoppingDate: "2023-07-27",
      expiryDateStart: "2023-07-27",
      expiryDateEnd: "2023-07-31",
      listId: "99",
      isBought: true,
      isFinish: true,
      differentDay: -4,
      isDelete: false,
      memosCount: 3,
      totalBudget: 9999,
    },
  ];

  const mockFunctions = {
    alertLists: testAllay,
    clickAlertDelete: true,
    register: jest.fn(),
    onClickAlertListBody: jest.fn(),
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(<OkaimonoAlertList {...mockFunctions} />);
  });

  describe("differentDayが0より大きいとき", () => {
    test("日付の表示色がred.500であること", async() => {
      const textRed = await utils.getByText("1日")
      const { debug } = utils;
      debug()
      expect(textRed).toHaveStyle("rgb(255, 0, 0)")
      console.log(window.getComputedStyle(textRed).color)
    });
  });
});
