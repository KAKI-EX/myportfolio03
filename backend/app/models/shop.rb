class Shop < ApplicationRecord
  belongs_to :user
  has_many :shopping_datum
  has_many :memos
end
