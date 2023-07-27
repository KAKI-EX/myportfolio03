import { render, RenderResult } from "@testing-library/react";
import { AuthContext } from "App";
import { MenuDrawer } from "components/molecules/MenuDrawer";

describe("MenuDrawer", () => {
  const mockFunctions = {
    onClose: jest.fn(),
    isOpen: true,
    onClickHome: jest.fn(),
    onClickSignIn: jest.fn(),
    onClickSignUp: jest.fn(),
    onClickMakeMemo: jest.fn(),
    onClickSignOut: jest.fn(),
    onClickMemoIndex: jest.fn(),
    onClickShopShow: jest.fn(),
    onClickMemoUse: jest.fn(),
    onClickAlert: jest.fn(),
    onClickSearch: jest.fn(),
  };

  const testUser = {
    id: 999,
    uid: "9999",
    provider: "test",
    email: "test@gmail.com",
    name: "testUser",
    allowPasswordChange: false,
    createdAt: new Date("2023-07-26"),
    updatedAt: new Date("2023-07-26"),
  };

  describe("ユーザーが未ログインのとき", () => {
    let utils: RenderResult;

    beforeEach(() => {
      utils = render(
        <AuthContext.Provider
          value={{
            loading: false,
            setLoading: jest.fn(),
            isSignedIn: false,
            setIsSignedIn: jest.fn(),
            currentUser: undefined,
            setCurrentUser: jest.fn(),
          }}
        >
          <MenuDrawer {...mockFunctions} />
        </AuthContext.Provider>
      );
    });

    test("TOPとサインイン、アカウントの作成が表示されていること", async () => {
      expect(await utils.getByText("TOP")).not.toHaveStyle("display: none");
      expect(await utils.getByText("サインイン")).not.toHaveStyle("display: none");
      expect(await utils.getByText("アカウントの作成")).not.toHaveStyle("display: none");
    });

    test("TOPとサインイン以外が表示されていないこと", async () => {
      expect(await utils.getByText("お買物メモの作成")).toHaveStyle("display: none");
      expect(await utils.getByText("お買物メモ一覧")).toHaveStyle("display: none");
      expect(await utils.getByText("お店情報の確認と編集")).toHaveStyle("display: none");
      expect(await utils.getByText("お買い物メモを使う")).toHaveStyle("display: none");
      expect(await utils.getByText("サインアウト")).toHaveStyle("display: none");
      expect(await utils.getByText("消費期限アラート")).toHaveStyle("display: none");
      expect(await utils.getByText("お買い物サーチ")).toHaveStyle("display: none");
    });
  });

  describe("ユーザーがログイン済みのとき", () => {
    let utils: RenderResult;

    beforeEach(() => {
      utils = render(
        <AuthContext.Provider
          value={{
            loading: false,
            setLoading: jest.fn(),
            isSignedIn: true,
            setIsSignedIn: jest.fn(),
            currentUser: undefined,
            setCurrentUser: jest.fn(),
          }}
        >
          <MenuDrawer {...mockFunctions} />
        </AuthContext.Provider>
      );
    });

    test("サインイン、アカウントの作成が表示されていないこと", async () => {
      expect(await utils.getByText("サインイン")).toHaveStyle("display: none");
      expect(await utils.getByText("アカウントの作成")).toHaveStyle("display: none");
    });

    test("サインインとアカウントの作成以外が表示されていること", async () => {
      expect(await utils.getByText("TOP")).not.toHaveStyle("display: none");
      expect(await utils.getByText("お買物メモの作成")).not.toHaveStyle("display: none");
      expect(await utils.getByText("お買物メモ一覧")).not.toHaveStyle("display: none");
      expect(await utils.getByText("お店情報の確認と編集")).not.toHaveStyle("display: none");
      expect(await utils.getByText("お買い物メモを使う")).not.toHaveStyle("display: none");
      expect(await utils.getByText("サインアウト")).not.toHaveStyle("display: none");
      expect(await utils.getByText("消費期限アラート")).not.toHaveStyle("display: none");
      expect(await utils.getByText("お買い物サーチ")).not.toHaveStyle("display: none");
    });
  });
});
