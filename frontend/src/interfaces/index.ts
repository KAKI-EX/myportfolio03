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

export interface OkaimonoParams {
  user_id?: string;
  shop_id?: string;
  shop_name?: string;
  estimated_budget?: string;
  shopping_memo?: string;
  shopping_date?: string;
  total_budget?: number;
  shopping_datum_id?: string;
  listForm?: ListFormParams[];
}
