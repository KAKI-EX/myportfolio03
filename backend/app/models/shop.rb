class Shop < ApplicationRecord
  validates_uniqueness_of :shop_name, scope: :user_id
  validates :shop_name, length: {maximum: 35, message: "は%{count}文字以上の登録はできません。"}

  belongs_to :user, foreign_key: 'user_id', primary_key: 'id'
  has_many :shopping_datum, dependent: :destroy
  has_many :memos, dependent: :destroy
end
