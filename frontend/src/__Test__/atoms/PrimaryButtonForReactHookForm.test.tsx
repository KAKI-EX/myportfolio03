import { fireEvent, render } from "@testing-library/react";
import { PrimaryButtonForReactHookForm } from "components/atoms/PrimaryButtonForReactHookForm";

describe("PrimaryButtonForReactHookForm", () => {
  test("childrenが表示されること", () => {
    const { getByText } = render(<PrimaryButtonForReactHookForm>テストボタン</PrimaryButtonForReactHookForm>);
    expect(getByText("テストボタン")).toBeInTheDocument();
  });
  test("disabledがfalseの場合、ボタンをクリックできること", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <PrimaryButtonForReactHookForm onClick={onClickMock} disabled={false}>
        テストボタン
      </PrimaryButtonForReactHookForm>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).toHaveBeenCalled();
  });
  test("disabledがTrueの場合、ボタンをクリックできないこと", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <PrimaryButtonForReactHookForm onClick={onClickMock} disabled={true}>
        テストボタン
      </PrimaryButtonForReactHookForm>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
  test("isLoadingがtrueのとき、ボタンをクリックできないこと", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <PrimaryButtonForReactHookForm onClick={onClickMock} disabled={true}>
        テストボタン
      </PrimaryButtonForReactHookForm>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
});
