import { fireEvent, render, RenderResult } from "@testing-library/react";
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
      shoppingDate: "2023-07-28",
      expiryDateStart: "2023-07-28",
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
      shoppingDate: "2023-07-29",
      expiryDateStart: "2023-07-29",
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

  const onClickMockAlertListBody = jest.fn()

  const mockFunctions = {
    alertLists: testAllay,
    clickAlertDelete: true,
    register: jest.fn(),
    onClickAlertListBody: onClickMockAlertListBody,
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(<OkaimonoAlertList {...mockFunctions} />);
  });

  describe("testAllayが表示されたとき", () => {
    test("testPurchaseRedが正しく表示されていること", async () => {
      const purchaseName = await utils.getByText("testPurchaseRed");
      const shoppingDate = await utils.getByText("2023年7月27日");
      expect(purchaseName).toBeInTheDocument();
      expect(shoppingDate).toBeInTheDocument();
    });
    test("testPurchaseYellowが正しく表示されていること", async () => {
      const purchaseName = await utils.getByText("testPurchaseYellow");
      const shoppingDate = await utils.getByText("2023年7月28日");
      expect(purchaseName).toBeInTheDocument();
      expect(shoppingDate).toBeInTheDocument();
    });
    test("testPurchaseGreenが正しく表示されていること", async () => {
      const purchaseName = await utils.getByText("testPurchaseYellow");
      const shoppingDate = await utils.getByText("2023年7月29日");
      expect(purchaseName).toBeInTheDocument();
      expect(shoppingDate).toBeInTheDocument();
    });
  });

  describe("該当する部分がクリックされたとき", () => {
    test("onClickAlertListBodyが発火すること", async () => {
      const alertBody = await utils.getByText("1日");
      fireEvent.click(alertBody);
      expect(onClickMockAlertListBody).toHaveBeenCalled()
    });
    test("チェックボックスが存在すること", async () => {
      const checkboxes = await utils.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeInTheDocument();
      });
    });
  });

  describe("differentDay > 0のとき", () => {
    test("日付の表示色がred.500であること", async () => {
      const textRed = await utils.getByText("1日");
      expect(textRed).toHaveStyle("color: rgb(229, 62, 62");
    });
  });

  describe("alert.differentDay > -3のとき", () => {
    test("日付の表示色がyellow.500であること", async () => {
      const textRed = await utils.getByText("-3日");
      expect(textRed).toHaveStyle("color: rgb(214, 158, 46");
    });
  });

  describe("上記2つ以外ののとき", () => {
    test("日付の表示色がgreen.500であること", async () => {
      const textRed = await utils.getByText("-4日");
      expect(textRed).toHaveStyle("color: rgb(56, 161, 105");
    });
  });
});
