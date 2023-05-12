class Api::V1::Okaimono::MemosController < ApplicationController

  def index
    memos = User.find(params[:id]).memos
    render json: memos
  end

  def create
    memos = memo_params.map { |param| Memo.new(param) }

    Memo.transaction do
      memos.each do |memo|
        memo.save!
      end
    end

    render json: memos
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def memo_params
    params.require(:memos).map do | memo_param |
      memo_param.permit(
        :user_id,
        :shop_id,
        :shopping_datum_id,
        :purchase_name,
        :shopping_detail_memo,
        :amount,
        :price,
        :shopping_date,
        :memo_type
        )
    end
  end
    # binding.pry
    # params.require(:memo).permit(
    #                               :user_id,
    #                               :shop_id,
    #                               :shopping_datum_id,
    #                               :purchase_name,
    #                               :shopping_detail_memo,
    #                               :amount,
    #                               :price,
    #                               :shopping_date,
    #                               :memo_type
    #                             )
end
