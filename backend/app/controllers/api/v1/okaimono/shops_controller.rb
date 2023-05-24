class Api::V1::Okaimono::ShopsController < ApplicationController
  # before_action :set_shop, only: %i[show destroy update]

  def index
    shops = User.find(params[:user_id]).shops
    add_count = shops.map{ |shop| shop.attributes.merge({ "shopping_data_count": shop.shopping_datum.count })}
    render json: add_count
  end

  def create
    shop = Shop.new(shop_params)
    existing_shop = User.find(shop.user_id).shops.where(shop_name: shop.shop_name)

    if existing_shop.exists?
      render json: existing_shop.first
    elsif shop.save!
      render json: shop
    else
      render json: shop.errors
    end
  end

  def show
    shop = User.find(params[:user_id]).shops.find(params[:shop_id])
    render json: shop
  end

  def update
    shop = User.find(shop_params[:user_id]).shops.find(shop_params[:id])
    if shop.update!(shop_params)
      render json: shop
    else
      render json: shop.errors, status: :unprocessable_entity
    end
  end
  private

  def shop_params
    params.require(:shop).permit(:user_id, :shop_name, :shop_memo, :id)

  end

end
