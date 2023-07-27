import { fireEvent, render } from "@testing-library/react";
import { BottomPagination } from "components/molecules/BottomPagination"

describe("BottomPagination", () => {
  const mockSetLoading = jest.fn();
  const mockSetSearchCurrentPage = jest.fn();
  const mockSetCurrentPage = jest.fn();

  test('前のページボタンがクリックされ、clickOnSearchがfalseのとき、正しい関数が呼び出されること', () => {
    const { getByText } = render(
      <BottomPagination
        currentPage={2}
        searchCurrentPage={2}
        setLoading={mockSetLoading}
        clickOnSearch={false}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
      />
    );

    fireEvent.click(getByText('前のページ'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetCurrentPage).toHaveBeenCalled();
  });

  test('前のページボタンがクリックされ、clickOnSearchがtrueのとき、正しい関数が呼び出されること', () => {
    const { getByText } = render(
      <BottomPagination
        currentPage={2}
        searchCurrentPage={2}
        setLoading={mockSetLoading}
        clickOnSearch={true}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
      />
    );

    fireEvent.click(getByText('前のページ'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetSearchCurrentPage).toHaveBeenCalled();
  });

  test('currentPageとsearchCurrentPageが1のとき、前のページボタンが表示されないこと', () => {
    const { queryByText } = render(
      <BottomPagination
        currentPage={1}
        searchCurrentPage={1}
        setLoading={mockSetLoading}
        clickOnSearch={true}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={2}
      />
    );
    expect(queryByText('前のページ')).toBeNull();
  });

  test('次のページボタンがクリックされ、clickOnSearchがfalseのとき、正しい関数が呼び出されること', () => {
    const { getByText } = render(
      <BottomPagination
        currentPage={2}
        searchCurrentPage={2}
        setLoading={mockSetLoading}
        clickOnSearch={false}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={3}
      />
    );

    fireEvent.click(getByText('次のページ'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetCurrentPage).toHaveBeenCalled();
  });

  test('次のページボタンがクリックされ、clickOnSearchがtrueのとき、正しい関数が呼び出されること', () => {
    const { getByText } = render(
      <BottomPagination
        currentPage={2}
        searchCurrentPage={2}
        setLoading={mockSetLoading}
        clickOnSearch={true}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={3}
      />
    );

    fireEvent.click(getByText('次のページ'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetSearchCurrentPage).toHaveBeenCalled();
  });

  test('currentPageとsearchCurrentPageがtotalPagesと等しいとき、次のページボタンが表示されないこと', () => {
    const { queryByText } = render(
      <BottomPagination
        currentPage={1}
        searchCurrentPage={1}
        setLoading={mockSetLoading}
        clickOnSearch={true}
        setSearchCurrentPage={mockSetSearchCurrentPage}
        setCurrentPage={mockSetCurrentPage}
        totalPages={1}
      />
    );
    expect(queryByText('次のページ')).toBeNull();
  });
});
