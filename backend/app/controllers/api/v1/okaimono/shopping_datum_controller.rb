class Api::V1::Okaimono::ShoppingDatumController < ApplicationController
  before_action :find_shopping, only: [:show, :update, :destroy]
  before_action :authenticate_api_v1_user!, except: [:show_open_memo, :update_open_memo]

  def index
    shopping = current_api_v1_user.shopping_data
    shapping = shopping.map do |s_data|
      s_data.attributes.merge({ 'memos_count': s_data.memos.count })
    end
    render json: shapping
  end

  def record_index
    shopping_records = current_api_v1_user.shopping_data.is_finish_true.order(:shopping_date).page((params[:page] || 1)).per(5)
    total_pages = shopping_records.total_pages
    if shopping_records.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      shopping_records = shopping_records.map do |record|
        record.attributes.merge({ 'memos_count': record.memos.count})
      end
      render json: { records: shopping_records, total_pages: total_pages }
    end
  end

  def search_by_shop
    shop = current_api_v1_user.shops.find_by(shop_name: params[:word])
    if shop.nil?
      render json: { error: 'お店が見つかりませんでした' }, status: :not_found
      return
    end
    shopping_records = shop.shopping_datum.is_finish_true.order(:shopping_date).page((params[:page] || 1)).per(5);
    total_pages = shopping_records.total_pages

    if shopping_records.empty?
      render json: { error: 'お買い物履歴が見つかりませんでした' }, status: :not_found
      return
    elsif params[:start].present? && params[:end].present?
      shopping_records = shopping_records.where(shopping_date: params[:start]..params[:end])
      if shopping_records.empty?
        render json: { error: 'お買い物履歴が見つかりませんでした' }, status: :not_found
        return
      end
    end

    shopping_records = shopping_records.map do |record|
      record.attributes.merge({ 'memos_count': record.memos.count})
    end

    render json: { records: shopping_records, total_pages: total_pages }
  end

  def search_by_purchase
    purchase = current_api_v1_user.memos.where(purchase_name: params[:word])
    if purchase.empty?
      render json: { error: '商品が見つかりませんでした' }, status: :not_found
      return
    end
    shopping_datum_ids = purchase.pluck(:shopping_datum_id)
    shopping_records = current_api_v1_user.shopping_data.is_finish_true.order(:shopping_date).where(id: shopping_datum_ids)

    if params[:start].present? && params[:end].present?
      shopping_records = shopping_records.where(shopping_date: params[:start]..params[:end])
      if shopping_records.empty?
        render json: { error: 'お買い物履歴が見つかりませんでした' }, status: :not_found
        return
      end
    end

    shopping_records = shopping_records.page((params[:page] || 1)).per(5);
    total_pages = shopping_records.total_pages

    shopping_records = shopping_records.map do |record|
      record.attributes.merge({ 'memos_count': record.memos.count})
    end

    render json: { records: shopping_records, total_pages: total_pages }
  end

  def create
    shopping = current_api_v1_user.shopping_data.new(shopping_params)
    if shopping.save
      render json: shopping
    else
      render json: { errors: '何らかのエラーにより作成できませんでした' }, status: :unprocessable_entity
    end
  end

  def show
    if @shopping.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    else
      render json: @shopping
    end
  end

  def show_open_memo
    shopping = User.find_by(id: params[:user_id]).shopping_data.find_by(id: params[:shopping_datum_id])

    if shopping.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    elsif shopping.is_open
      render json: shopping
    else
      render json: { error: '不正な操作が実行されました' }, status: :unprocessable_entity
    end
  end

  def update
    if @shopping.update(shopping_params)
      render json: @shopping
    else
      render json: { error: '更新に失敗しました' }, status: :not_modified
    end
  end

  def update_open_memo
    shopping = User.find_by(id: shopping_params[:user_id]).shopping_data.find_by(id: shopping_params[:shopping_datum_id])
    if shopping.nil?
      render json: { error: 'データが見つかりませんでした' }, status: :not_found
    elsif shopping.update(shopping_params.except(:user_id, :shopping_datum_id))
      render json: shopping
    else
      render json: { error: '更新に失敗しました' }, status: :not_modified
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
      :is_finish,
      :is_open,
      :is_signed_in
      )
  end

  def find_shopping
    @shopping = current_api_v1_user.shopping_data.find_by(id: params[:shopping_datum_id])
  end
end
