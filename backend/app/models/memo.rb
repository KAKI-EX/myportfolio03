class Memo < ApplicationRecord
  validates :user_id, :shop_id, :shopping_datum_id, presence: true
  validates :shopping_date, presence: { message: "買い物をする日付けが入力されていません" }
  validates :purchase_name, length: {maximum: 50, message: "商品名は%{count}文字以上の登録はできません。"}
  validates :shopping_detail_memo, length: {maximum: 150, message: "商品メモは%{count}文字以上の登録はできません。"}
  validates :amount, numericality: { only_integer: true, less_than_or_equal_to: 1000, message: "数字のみ入力してください。1000以上は入力できません" }

  belongs_to :user
  belongs_to :shop
  belongs_to :shopping_datum
end
