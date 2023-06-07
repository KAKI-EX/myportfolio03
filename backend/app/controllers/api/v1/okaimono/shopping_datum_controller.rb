class Api::V1::Okaimono::ShoppingDatumController < ApplicationController
  before_action :find_shopping, only: [:show, :update, :destroy]

  def index
    shopping = User.find(params[:id]).shopping_data
    shapping = shopping.map do |s_data|
      s_data.attributes.merge({ 'memos_count': s_data.memos.count })
    end
    render json: shapping
  end

  def create
    shopping = ShoppingDatum.new(shopping_params)
    if shopping.save
      render json: shopping
    else
      render json: shopping.errors
    end
  end

  def show
    if @shopping.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: @shopping
    end
  end

  def update
    if @shopping.update(shopping_params)
      render json: @shopping
    else
      render json: @shopping.errors
    end
  end

  def destroy
    if @shopping.destroy
      render json: @shopping
    else
      render json: @shopping.errors
    end
  end

  private

  def shopping_params
    params.require(:shopping_datum).permit(
      :user_id,
      :shop_id,
      :shopping_date,
      :shopping_memo,
      :estimated_budget,
      :total_budget,
      :shopping_datum_id,
      :is_finish
      )
  end

  def find_shopping
    @shopping = User.find(params[:user_id]).shopping_data.find(params[:shopping_datum_id])
  end
end
