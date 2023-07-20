import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";
import { fireEvent, render, screen } from "@testing-library/react";
import { MenuIconButton } from "components/atoms/MenuIconButton";

describe("MenuIconButton", () => {
  const onClickMock = jest.fn();
  test("メニューボタンが表示されること", () => {
    render(<MenuIconButton onOpen={onClickMock} />);
    const element = screen.getByLabelText("メニューボタン");
    expect(element).toBeInTheDocument();
  });
  test("MenuIconButtonをクリックすると関数が実行されること", () => {
    const { getByLabelText } = render(<MenuIconButton onOpen={onClickMock} />);
    fireEvent.click(getByLabelText("メニューボタン"));
    expect(onClickMock).toHaveBeenCalled();
  });
});
