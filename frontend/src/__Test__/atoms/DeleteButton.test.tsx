import { fireEvent, render } from "@testing-library/react";
import { DeleteButton } from "components/atoms/DeleteButton";

describe('DeleteButton', () => {
  test("childrenが表示されること", () => {
    const { getByText } = render(<DeleteButton>テストボタン</DeleteButton>);
    expect(getByText("テストボタン")).toBeInTheDocument();
  });
  test("disabledがfalseの場合、ボタンをクリックできること", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <DeleteButton onClick={onClickMock} disabled={false}>
        テストボタン
      </DeleteButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).toHaveBeenCalled();
  });
  test("disabledがTrueの場合、ボタンをクリックできないこと", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <DeleteButton onClick={onClickMock} disabled={true}>
        テストボタン
      </DeleteButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  });
  test("isLoadingがtrueのとき、ボタンをクリックできないこと", () => {
    const onClickMock = jest.fn();
    const { getByText } = render(
      <DeleteButton onClick={onClickMock} disabled={true}>
        テストボタン
      </DeleteButton>
    );
    fireEvent.click(getByText("テストボタン"));
    expect(onClickMock).not.toHaveBeenCalled();
  })
})
