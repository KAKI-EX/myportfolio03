# frozen_string_literal: true
class User < ActiveRecord::Base
  before_create :set_uuid

  has_many :shops
  has_many :shopping_data
  has_many :memos

  # VALID_PASSWORD_REGIX = /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]+\z/i

  # validates :email, presence: true
  # validates :password, presence: true, length: { minimum: 6 }, format: { with: VALID_PASSWORD_REGIX, message: "は英字と数字の両方を含めて設定してください" }
  # validates :password, presence: true

  def self.guest
    find_or_create_by!(email: 'guest@example.com') do |user|
      user.password = SecureRandom.urlsafe_base64
      # user.confirmed_at = Time.now  # Confirmable を使用している場合は必要
      # 例えば name を入力必須としているならば， user.name = "ゲスト" なども必要
    end
  end

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User

  private
  def set_uuid
    while self.id.blank? || User.find_by(id: self.id).present? do
      self.id = SecureRandom.uuid
    end
  end
end
