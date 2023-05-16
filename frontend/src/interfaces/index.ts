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
  shopping_datum_id?: string;
  purchase_name?: string;
  price?: string;
  shopping_detail_memo?: string;
  amount?: string;
  shopping_date?: string;
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
  listForm?: ListFormParams[];
}
// --------------------indexページのtype---------------------
export interface OkaimonoMemoData {
  createdAt: string;
  estimatedBudget: string;
  id: number;
  memosCount: number;
  shopId: number;
  shoppingDate: string;
  shoppingMemo: string;
  totalBudget: string;
  updatedAt: string;
  userId: number;
}

export interface OkaimonoMemoResponse {
  data: OkaimonoMemoData[];
  status: number;
}
// --------------------------------------------------------
