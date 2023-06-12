class Api::V1::Okaimono::ShopsController < ApplicationController
  # before_action :set_shop, only: %i[show destroy update]
  before_action :authenticate_api_v1_user!


  def index
    shops = current_api_v1_user.shops
    add_count = shops.map{ |shop| shop.attributes.merge({ "shopping_data_count": shop.shopping_datum.count })}
    render json: add_count
  end

  def create
    shop = current_api_v1_user.shops.new(shop_params)
    existing_shop = current_api_v1_user.shops.where(shop_name: shop.shop_name)

    if existing_shop.exists?
      render json: existing_shop.first
    elsif shop.save
      render json: shop
    else
      render json: { errors: shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    shop = current_api_v1_user.shops.find(params[:shop_id])
    render json: shop
  end

  def update
    shop = current_api_v1_user.shops.find(shop_params[:id])
    if shop.update(shop_params)
      render json: shop
    else
      render json: { errors: shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    shop = current_api_v1_user.shops.find(params[:id])
    if shop.destroy
      render json: {shop: shop, message: "正常に削除されました"}
    else
      render json: { errors: shop.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def shop_params
    params.require(:shop).permit(:shop_name, :shop_memo, :id)
  end

end
