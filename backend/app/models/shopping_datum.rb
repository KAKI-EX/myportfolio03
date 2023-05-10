class ShoppingDatum < ApplicationRecord
  belongs_to :user
  belongs_to :shop
  has_many :memos
end
