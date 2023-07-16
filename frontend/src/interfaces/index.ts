// サインアップ
export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

// サインイン
export interface SignInParams {
  email: string;
  password: string;
}

// ユーザー
export interface User {
  id: number;
  uid: string;
  provider: string;
  email: string;
  name: string;
  nickname?: string;
  image?: string;
  allowPasswordChange: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// メモページ
export interface ListFormParams {
  userId?: string;
  shopId?: string;
  id?: string;
  asc?: string;
  shoppingDatumId?: string;
  purchaseName?: string;
  price?: string;
  shoppingDetailMemo?: string;
  amount?: string;
  shoppingDate?: string;
  expiryDateStart?: string;
  expiryDateEnd?: string;
  listId?: string;
  isBought?: boolean;
  isFinish?: boolean | null;
  differentDay?: number
  isDelete?: boolean;
  memosCount?: number;
  totalBudget?: number;
}

export interface alertParams{
  listForm?: ListFormParams[];
}

export interface MergeParams {
  userId?: string;
  shopName?: string;
  estimatedBudget?: string;
  shoppingMemo?: string;
  totalBudget?: number;
  shopId?: string;
  shoppingDatumId?: string;
  purchaseName?: string;
  price?: string;
  listId?: string;
  shoppingDetailMemo?: string;
  amount?: string;
  shoppingDate?: string;
  asc?: string;
  expiryDateStart?: string;
  expiryDateEnd?: string;
  modifyPurchaseName?: string;
  modifyAmount?: string;
  modifyMemo?: string;
  modifyExpiryDateStart?: string;
  modifyExpiryDateEnd?: string;
  modifyShoppingDate?: string;
  modifyEstimatedBudget?: string;
  modifyShoppingMemo?: string;
  modifyShopName?: string;
  modyfyShoppingDatumId?: string;
  modifyId?: string;
  modifyAsc?: string;
  modifyShopId?: string;
  modifyListShoppingDate?: string;
  modifyListShoppingDatumId?: string;
  isBought?: boolean;
  isFinish?: boolean | null;
  isOpen?: boolean;
  indexNumber?: number;
  listForm?: ListFormParams[];
}
// --------------------indexページのtype---------------------
export interface OkaimonoMemoData {
  userId?: string;
  createdAt: string;
  estimatedBudget: string;
  id: string;
  memosCount: number;
  shopId: string;
  shoppingDate: string;
  shoppingMemo: string;
  totalBudget: string;
  updatedAt: string;
  isOpen: boolean;
  isFinish: boolean | null;
}

export interface OkaimonoMemoResponse {
  data: OkaimonoMemoData[];
  status: number;
}
// ------------------okaimono showページ---------------------

export interface OkaimonoMemoDataShow {
  createdAt: string;
  estimatedBudget: string;
  id: string;
  memosCount: number;
  shopId: string;
  shoppingDate: string;
  shoppingMemo: string;
  totalBudget: string;
  updatedAt: string;
  modifyShoppingDate?: string;
  modifyEstimatedBudget?: string;
  modifyShoppingMemo?: string;
}

export interface OkaimonoMemoDataShowResponse {
  data: OkaimonoMemoData;
  status: number;
}

export interface OkaimonoShopData {
  id: string;
  createdAt: string;
  shopMemo: string;
  shopName: string;
  updatedAt: string;
}

export interface OkaimonoShopDataResponse {
  data: OkaimonoShopData;
  status: number;
}

export interface OkaimonoMemosData {
  amount: string;
  createdAt: string;
  id: string;
  memoType: string;
  price: string;
  purchaseName: string;
  shopId: string;
  shoppingDate: string;
  shoppingDatumId: string;
  shoppingDetailMemo: string;
  updatedAt: string;
  expiryDateStart: string;
  expiryDateEnd: string;
  asc: string;
}

export interface OkaimonoMemosDataResponse {
  data: OkaimonoMemosData[];
  status: number;
}

export interface OkaimonoShopsIndexData {
  createdAt: string;
  id: string;
  shopMemo: string;
  shopName: string;
  shoppingDataCount: string;
  updatedAt: string;
}

export interface OkaimonoShopsDataResponse {
  data: OkaimonoShopsIndexData[];
  status: number;
}

export interface OkaimonoShopModifingData {
  shopName: string;
  shopMemo: string;
  shopId?: string;
  id?: string;
}

export interface GetSingleMemoData {
  purchaseName: string;
  amount: string;
  shoppingDetailMemo: string;
  expiryDateStart: string;
  expiryDateEnd: string;
  id: string;
  asc: string;
  shopId: string;
  shoppingDate: string;
  shoppingDatumId: string;
}

export interface GetSingleMemo {
  data: GetSingleMemoData;
  status: number;
}

export interface GetAlertIndex {
  data: ListFormParams[];
  status: number;
}

export interface GetOkaimonoRecord {
  data: {records: ListFormParams[], totalPages: number};
  status: number;
}

export interface UseFormOnSearchPage {
  startDate: Date;
  endDate: Date;
  shoppingDate: string;
  searchSelect: string;
  searchWord: string;
};
