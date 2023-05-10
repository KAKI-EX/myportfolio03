# frozen_string_literal: true
class User < ActiveRecord::Base
  has_many :shops
  has_many :shopping_data
  has_many :memos

  # VALID_PASSWORD_REGIX = /\A(?=.*?[a-z])(?=.*?\d)[a-z\d]+\z/i

  # validates :email, presence: true
  # validates :password, presence: true, length: { minimum: 6 }, format: { with: VALID_PASSWORD_REGIX, message: "は英字と数字の両方を含めて設定してください" }
  # validates :password, presence: true




  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  include DeviseTokenAuth::Concerns::User
end
