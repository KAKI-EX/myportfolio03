class Api::V1::Okaimono::ShoppingDatumController < ApplicationController

  def index
    shopping = User.find(params[:id]).shopping_data
    shapping = shopping.map do |s_data|
      s_data.attributes.merge({ 'memos_count': s_data.memos.count })
    end
    render json: shapping
  end

  def create
    shopping = ShoppingDatum.new(shopping_params)
    if shopping.save!
      render json: shopping
    else
      render json: shopping.errors
    end
  end

  def show
    shopping = User.find(params[:user_id]).shopping_data.find(params[:shopping_data])
    render json: shopping
  end

  private

  def shopping_params
    params.require(:shopping_datum).permit(:user_id, :shop_id, :shopping_date, :shopping_memo, :estimated_budget, :total_budget)
  end
end
