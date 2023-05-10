class Api::V1::Okaimono::ShoppingDatumController < ApplicationController

  def index
    shopping = User.find(params[:id]).shopping_datum
    render json: shopping
  end

  def create
    shopping = ShoppingDatum.new(shopping_params)
    if shopping.save
      render json: shopping
    else
      render json: shopping.errors
    end
  end

  private

  def shopping_params
    params.require(:shopping_datum).permit(:user_id, :shop_id, :shopping_date, :shopping_memo, :estimated_budget, :total_budget)
  end
end
