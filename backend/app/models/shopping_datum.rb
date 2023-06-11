class ShoppingDatum < ApplicationRecord
  before_create :set_base64
  validates :user_id, :shop_id, :shopping_date, presence: true
  validates :shopping_memo, length: {maximum: 150, message: "買い物メモは%{count}文字以上の登録はできません。"}
  validates :estimated_budget, :total_budget, numericality: { only_integer: true, message: "お買い物の予算は数字のみ入力してください。" }, allow_blank: true

  belongs_to :user, foreign_key: 'user_id', primary_key: 'id'
  belongs_to :shop
  has_many :memos, dependent: :destroy

  private
  def set_base64
    while self.id.blank? || User.find_by(id: self.id).present? do
      self.id = SecureRandom.base64(20)
    end
  end
end
