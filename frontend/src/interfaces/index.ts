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
  created_at: Date;
  updated_at: Date;
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
  memoId?: string;
  isBought?: boolean;
  isFinish?: boolean;
}

export interface MergeParams {
  shopName?: string;
  estimatedBudget?: string;
  shoppingMemo?: string;
  totalBudget?: number;
  userId?: string;
  shopId?: string;
  shoppingDatumId?: string;
  purchaseName?: string;
  price?: string;
  shoppingDetailMemo?: string;
  amount?: string;
  shoppingDate?: string;
  shipping_datum_id?: string;
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
  modifyShopId?: string
  modifyListShoppingDate?: string;
  modifyListShoppingDatumId?: string;
  isBought?: boolean;
  isFinish?: boolean;
  listForm?: ListFormParams[];
}
// --------------------indexページのtype---------------------
export interface OkaimonoMemoData {
  createdAt: string;
  estimatedBudget: string;
  id: string;
  memosCount: number;
  shopId: string;
  shoppingDate: string;
  shoppingMemo: string;
  totalBudget: string;
  updatedAt: string;
  userId: string;
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
  userId: string;
  modifyShoppingDate?: string;
  modifyEstimatedBudget?: string;
  modifyShoppingMemo?: string;
}

export interface OkaimonoMemoDataShowResponse {
  data: OkaimonoMemoData;
  status: number;
}

export interface OkaimonoShopData {
  id: number;
  createdAt: string;
  shopMemo: string;
  shopName: string;
  updatedAt: string;
  userId: string;
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
  userId: string;
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
  userId: string;
}

export interface OkaimonoShopsDataResponse {
  data: OkaimonoShopsIndexData[];
  status: number;
}

export interface OkaimonoShopModifingData {
  shopName: string;
  shopMemo: string;
  userId: string;
  shopId?: string;
  id?: string;
}
