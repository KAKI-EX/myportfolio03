class Api::V1::Okaimono::ShopsController < ApplicationController
  # before_action :set_shop, only: %i[show destroy update]

  def index
    shops = User.find(params[:id]).shops
    render json: shops
  end

  def create
    shop = Shop.new(shop_params)
    existing_shop = User.find(shop.user_id).shops.where(shop_name: shop.shop_name)

    if existing_shop.exists?
      render json: existing_shop.first
    elsif shop.save
      render json: shop
    else
      render json: shop.errors
    end
  end

  private

  def shop_params
    params.require(:shop).permit(:user_id, :shop_name, :shop_memo)

  end

end