class Memo < ApplicationRecord
  belongs_to :user
  belongs_to :shop
  belongs_to :shopping_data
end
