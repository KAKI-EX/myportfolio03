class Shop < ApplicationRecord
  validates_uniqueness_of :shop_name, scope: :user_id


  belongs_to :user
  has_many :shopping_datum, dependent: :destroy
  has_many :memos, dependent: :destroy
end
