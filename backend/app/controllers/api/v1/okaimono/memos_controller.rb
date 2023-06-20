class Api::V1::Okaimono::MemosController < ApplicationController
  before_action :authenticate_api_v1_user!, except: [:show_open_memos, :show_open_memo, :update_open_memo, :create_open_memos, :update_open_memos, :destroy_open_memo]

  def index
    memos = current_api_v1_user.memos
    render json: memos
  end

  def create
    memos = memos_params.map { |param| current_api_v1_user.memos.new(param) }

    created_memos = current_api_v1_user.memos.transaction do
      memos.each do |memo|
        memo.save!
      end
    end

    render json: created_memos
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def create_open_memos
    memos = memos_params.map { |param| User.find_by(id: param[:user_id]).memos.new(param) }
    if memos.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      user_id = memos.first.user_id
      created_memos = User.find_by(id: user_id).memos.transaction do
        memos.each do |memo|
          memo.save!
        end
      end
    end

    render json: created_memos
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def show
    memos = current_api_v1_user.shopping_data.find_by(id: params[:shopping_id]).memos.order(:asc)
    if memos.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memos
    end
  end

  def show_open_memos
    memos = User.find_by(id: params[:user_id]).shopping_data.find_by(id: params[:shopping_id]).memos.order(:asc)
    if memos.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memos
    end
  end

  def show_memo
    memo = current_api_v1_user.memos.find_by(id: params[:memo_id])
    if memo.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memo
    end
  end

  def show_open_memo
    memo = User.find_by(id: params[:user_id]).memos.find_by(id: params[:memo_id])
    if memo.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memo
    end
  end

  def update
    Memo.transaction do
      update_memos = memos_params.each do |params|
        shopping_data = current_api_v1_user.shopping_data.find(params[:shopping_datum_id])
        exsisting_memo = shopping_data.memos.find(params[:memo_id])
        exsisting_memo.update!(params.except(:memo_id, :user_id))
      end
        render json: update_memos
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def update_open_memos
    Memo.transaction do
      update_memos = memos_params.each do |params|
        shopping_data = User.find_by(id: params[:user_id]).shopping_data.find(params[:shopping_datum_id])
        exsisting_memo = shopping_data.memos.find(params[:memo_id])
        exsisting_memo.update!(params.except(:memo_id, :user_id))
      end
        render json: update_memos
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def update_open_memo
    list_data = User.find_by(id: one_memo_params[:user_id]).shopping_data.find_by(id: one_memo_params[:shopping_datum_id])
    if list_data.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      exsisting_memo = list_data.memos.find_by(id: one_memo_params[:memo_id])
      exsisting_memo.update(one_memo_params.except(:memo_id, :user_id))
      render json: exsisting_memo.reload
    end
  end

  def destroy
    Memo.transaction do
      memos_params.each do |params|
        delete_memo = current_api_v1_user.memos.find(params[:memo_id])
        delete_memo.destroy!
      end
      render json: memos_params
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  def destroy_open_memo
    Memo.transaction do
      memos_params.each do |params|
        delete_memo = User.find_by(id: params[:user_id]).memos.find(params[:memo_id])
        delete_memo.destroy!
      end
      render json: memos_params
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end


  private

  def one_memo_params
    params.require(:memos).permit(
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
      :expiry_date_end,
      :is_bought
      )
  end


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
        :expiry_date_end,
        :is_bought
        )
    end
  end
end
