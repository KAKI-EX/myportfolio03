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
  created_at: Date;               // eslint-disable-line
  updated_at: Date;               // eslint-disable-line
}
// メモページ
export interface OkaimonoParams {
  user_id?: string;
  shop_id?: string;
  shop_name?: string;
  estimated_budget?: string;
  shopping_memo?: string;          // eslint-disable-line
  shopping_date?: string;          // eslint-disable-line
  total_budget?: number;
  listForm?: Array<{
    purchase_name: string;        // eslint-disable-line
    price: string;
    shopping_memo: string;         // eslint-disable-line
    amount: string;
  }>;
}
