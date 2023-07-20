import { fireEvent, render } from "@testing-library/react";
import { PrimaryButton } from "components/atoms/PrimaryButton";

describe("PrimaryButton", () => {
  const onClickMock = jest.fn();
  test("childrenが表示されること", () => {
    const { getByText } = render(<PrimaryButton onClick={onClickMock}>テストボタン</PrimaryButton>);
    expect(getByText("テストボタン")).toBeInTheDocument();
  });
  test("disabledがfalseの場合、ボタンをクリックできること", () => {
    const { getByText } = render(
      <PrimaryButton onClick={onClickMock} disabled={false}>
        テストボタン
      </PrimaryButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).toHaveBeenCalled();
  });
  test("disabledがTrueの場合、ボタンをクリックできないこと", () => {
    const { getByText } = render(
      <PrimaryButton onClick={onClickMock} disabled={true}>
        テストボタン
      </PrimaryButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
  test("isLoadingがtrueのとき、ボタンをクリックできないこと", () => {
    const { getByText } = render(
      <PrimaryButton onClick={onClickMock} disabled={true}>
        テストボタン
      </PrimaryButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
});
