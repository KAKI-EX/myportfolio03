import { fireEvent, render } from "@testing-library/react";
import { OptionallyButton } from "components/atoms/OptionallyButton";

describe("OptionallyButton", () => {
  const onClickMock = jest.fn();
  test("childrenが表示されること", () => {
    const { getByText } = render(<OptionallyButton onClick={onClickMock}>テストボタン</OptionallyButton>);
    expect(getByText("テストボタン")).toBeInTheDocument();
  });
  test("disabledがfalseの場合、ボタンをクリックできること", () => {
    const { getByText } = render(
      <OptionallyButton onClick={onClickMock} disabled={false}>
        テストボタン
      </OptionallyButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).toHaveBeenCalled();
  });
  test("disabledがTrueの場合、ボタンをクリックできないこと", () => {
    const { getByText } = render(
      <OptionallyButton onClick={onClickMock} disabled={true}>
        テストボタン
      </OptionallyButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
  test("isLoadingがtrueのとき、ボタンをクリックできないこと", () => {
    const { getByText } = render(
      <OptionallyButton onClick={onClickMock} disabled={true}>
        テストボタン
      </OptionallyButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
});
