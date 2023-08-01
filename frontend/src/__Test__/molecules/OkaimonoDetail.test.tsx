import { SmallCloseIcon } from "@chakra-ui/icons";
import { render, RenderResult } from "@testing-library/react";
import { OkaimonoDetail } from "components/molecules/OkaimonoDetail";

describe("OkaimonoDetail", () => {
  const getValuesMock = jest.fn().mockReturnValue(99); //getValuesを再現するために記述。


  const testPurchaseObjs = [
    {
      userId: "test1",
      shopId: "shopId",
      id: "1",
      asc: "0",
      purchaseName: "testPurchase1",
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
    },
    {
      userId: "test2",
      shopId: "shopId",
      id: "2",
      asc: "1",
      purchaseName: "testPurchase2",
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
    },
  ];

  const FieldMocks = [
    {
      amount: "",
      asc: "",
      expiryDateEnd: "",
      expiryDateStart: "",
      id: "",
      key: "43ea4b2c-54a6-465b-9ae8-25e68eb94dc9",
      price: "",
      purchaseName: "",
      shoppingDetailMemo: ""
    }
  ];

  const mockFunctions = {
    fields: FieldMocks,
    insertInputForm: jest.fn(),
    SmallCloseIcon,
    remove: jest.fn(),
    register: jest.fn().mockReturnValue({
      ref: jest.fn(),
      onChange: jest.fn(),
      name: 'listForm',
    }),
    errors: {},
    validationNumber: /^[0-9]+$/,
    readOnly: false,
    getValues: getValuesMock,
    setDeleteIds: jest.fn(),
    watch: jest.fn(),
    expiryDate: false,
    onListChange: jest.fn(),
    purchaseNameSuggestions: testPurchaseObjs,
    setValue: jest.fn(),
    setPurchaseNameSuggestions: jest.fn(),
    purchaseNameIndex: 0,
  };

  let utils: RenderResult;

  beforeEach(() => {
    utils = render(<OkaimonoDetail {...mockFunctions} />);
  });

  test("テスト中", () => {
    console.log(mockFunctions.register.mock.calls);  // これにより、registerがどのように呼び出されたかを表示します
    console.log(mockFunctions.register('some name'));  // これは`{ ref: {}, onChange: jest.fn(), onBlur: jest.fn(), name: 'some name' }`を出力するはずです
  });

});
