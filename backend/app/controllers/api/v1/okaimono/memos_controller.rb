class Api::V1::Okaimono::MemosController < ApplicationController
  before_action :authenticate_api_v1_user!, except: [:show_open_memos, :show_open_memo, :update_open_memo, :create_open_memos, :update_open_memos, :destroy_open_memo]

  def index
    memos = current_api_v1_user.memos
    render json: memos
  end

  def suggestions_index
    purchases = current_api_v1_user.memos.by_purchase_name_like(params[:purchase_name]).limit(10).select(:id, :purchase_name).reject(&:blank?)
    unique_purchases = purchases.uniq { |purc| purc.purchase_name }
    purchases_json = unique_purchases.map { |purc| { id: purc.id, purchase_name: purc.purchase_name } }
    render json: purchases_json
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

  def show_alert
    memos = current_api_v1_user.memos.expirydate
    if memos.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
      return
    else
      add_diffday = memos.map do |memo|
        end_date = memo.expiry_date_end
        puts "End date: #{end_date.class}" # デバッグのための出力
        today = Date.today
        if end_date.nil?
          different_day = nil
        else
          different_day = (today - end_date).to_i
        end
        memo_attrs = memo.attributes
        memo_attrs["different_day"] = different_day
        memo_attrs
      end
    end
    sorted_memos = add_diffday.sort { |a, b| b["different_day"] <=> a["different_day"] }
    render json: sorted_memos
  end

  def show_memo
    memo = current_api_v1_user.memos.find_by(id: params[:list_id])
    if memo.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memo
    end
  end

  def show_open_memo
    memo = User.find_by(id: params[:user_id]).memos.find_by(id: params[:list_id])
    if memo.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: memo
    end
  end

  def update
    #if (params[:expiry_date_start] && params[:expiry_date_end]).present?
    #:expiry_date_startは必要ないため削除。カラムだけ残しておく。
    Memo.transaction do
      update_memos = memos_params.each do |params|
        shopping_data = current_api_v1_user.shopping_data.find(params[:shopping_datum_id])
        if (params[:expiry_date_end]).present?
          end_date = Date.parse(params[:expiry_date_end])
          existing_memo = shopping_data.memos.find(params[:list_id])
          existing_memo.assign_attributes(is_expiry_date: true, is_display: true)
          existing_memo.update!(params.except(:list_id, :user_id))
        else
          existing_memo = shopping_data.memos.find(params[:list_id])
          existing_memo.assign_attributes(is_expiry_date: false, is_display: true)
          existing_memo.update!(params.except(:list_id, :user_id))
        end
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
        existing_memo = shopping_data.memos.find(params[:list_id])
        existing_memo.update!(params.except(:list_id, :user_id))
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
      existing_memo = list_data.memos.find_by(id: one_memo_params[:list_id])
      existing_memo.update(one_memo_params.except(:list_id, :user_id))
      render json: existing_memo.reload
    end
  end

  def update_is_display
    if memos_params.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      Memo.transaction do
        update_result = memos_params.each do |params|
          target_list = current_api_v1_user.memos.find_by(id: params[:list_id])
          target_list.update_attribute(:is_display, false)
        end
        render json: update_result
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :unprocessable_entity
      end
    end
  end

  def destroy
    Memo.transaction do
      memos_params.each do |params|
        delete_memo = current_api_v1_user.memos.find(params[:list_id])
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
        delete_memo = User.find_by(id: params[:user_id]).memos.find(params[:list_id])
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
      :list_id,
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
        :list_id,
        :asc,
        :expiry_date_start,
        :expiry_date_end,
        :is_bought,
        :is_expiry_date,
        :is_display
      )
    end
  end
end
