class Api::V1::Okaimono::MemosController < ApplicationController

  def index
    memos = User.find(params[:id]).memos
    render json: memos
  end

  def create
    memos = memos_params.map { |param| Memo.new(param) }

    created_memos = Memo.transaction do
      memos.each do |memo|
        memo.save!
      end
    end

    render json: created_memos
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def show
    memos = User.find(params[:user_id]).shopping_data.find(params[:shopping_id]).memos.order(:asc)
    render json: memos
  end

  def update
    Memo.transaction do
      update_memos = memos_params.each do |params|
        user = User.find(params[:user_id])
        shopping_data = user.shopping_data.find(params[:shopping_datum_id])
        exsisting_memo = shopping_data.memos.find(params[:memo_id])
        exsisting_memo.update!(params.except(:memo_id, :user_id))
      end
        render json: update_memos
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
    end
  end

def destroy
  Memo.transaction do
    memos_params.each do |params|
      user = User.find(params[:user_id])
      delete_memo = user.memos.find(params[:memo_id])
      delete_memo.destroy!
    end
    render json: memos_params
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end


  private

  def memos_params
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
        :memo_type,
        :memo_id,
        :asc,
        :expiry_date_start,
        :expiry_date_end
        )
    end
  end
end
