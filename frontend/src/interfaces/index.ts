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
  created_at: Date; // eslint-disable-line
  updated_at: Date; // eslint-disable-line
}
// メモページ
export interface ListFormParams {
  user_id?: string;
  shop_id?: string;
  id?: string;
  asc?: string;
  shopping_datum_id?: string;
  purchase_name?: string;
  price?: string;
  shopping_detail_memo?: string;
  amount?: string;
  shopping_date?: string;
  expiry_date_start?: string;
  expiry_date_end?: string;
}

export interface MergeParams {
  shop_name?: string;
  estimated_budget?: string;
  shopping_memo?: string;
  total_budget?: number;
  user_id?: string;
  shop_id?: string;
  shopping_datum_id?: string;
  purchase_name?: string;
  price?: string;
  shopping_detail_memo?: string;
  amount?: string;
  shopping_date?: string;
  shipping_datum_id?: string;
  asc?: string;
  expiry_date_start?: string;
  expiry_date_end?: string;
  modify_purchase_name?: string;
  modify_amount?: string;
  modify_memo?: string;
  modify_expiry_date_start?: string;
  modify_expiry_date_end?: string;
  modify_shopping_date?: string;
  modify_estimated_budget?: string;
  modify_shopping_memo?: string;
  modify_shop_name?: string;
  modify_shopping_datum_id?: string;
  listForm?: ListFormParams[];
}
// --------------------indexページのtype---------------------
export interface OkaimonoMemoData {
  createdAt: string;
  estimatedBudget: string;
  id: string;
  memosCount: number;
  shopId: number;
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
  shopId: number;
  shoppingDate: string;
  shoppingMemo: string;
  totalBudget: string;
  updatedAt: string;
  userId: string;
  modify_shopping_date?: string;
  modify_estimated_budget?: string;
  modify_shopping_memo?: string;
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
  shopId: number;
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
