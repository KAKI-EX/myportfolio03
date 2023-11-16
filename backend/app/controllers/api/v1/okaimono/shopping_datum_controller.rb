class Api::V1::Okaimono::ShoppingDatumController < ApplicationController
  include ErrorHandler

  before_action :authenticate_api_v1_user!, except: [:show_open_memo, :update_open_memo]
  before_action :find_shopping_datum_for_query_params, only: [:show, :destroy]

  def index
    shopping_data = current_api_v1_user.shopping_data.order(shopping_date: "DESC")
    if shopping_data.empty?
      head :no_content
    else
      render json: formatted_shopping_data(shopping_data)
    end
  end

  def create
    shopping_data = current_api_v1_user.shopping_data.new(shopping_params)
    if shopping_data.save
      render json: shopping_data, status: :created
    else
      render_unprocessable_entity
    end
  end

  def show
    if @shopping_datum.nil?
      render_not_found_error
    else
      render json: @shopping_datum
    end
  end

  def show_open_memo
    shopping_datum = User.find_user(params[:user_id])&.find_shopping_datum(params[:shopping_datum_id])
    if shopping_datum.nil?
      render_not_found_error
    elsif shopping_datum.is_open
      render json: shopping_datum
    else
      render_unauthorized_operation
    end
  end

  def update
    shopping_datum = current_api_v1_user.find_shopping_datum(shopping_params[:shopping_datum_id])
    if shopping_datum&.update(shopping_params.except(:user_id, :shopping_datum_id))
      render json: shopping_datum
    else
      render_not_modified
    end
  end

  def update_open_memo
    shopping_datum = User.find_user(shopping_params[:user_id])&.find_shopping_datum(shopping_params[:shopping_datum_id])
    if shopping_datum.nil?
      render_not_found_error
    elsif shopping_datum.update(shopping_params.except(:user_id, :shopping_datum_id))
      render json: shopping_datum
    else
      render_not_modified
    end
  end

  def destroy
    if @shopping_datum&.destroy
      render json: @shopping_datum
    else
      render_not_found_error
    end
  end

  def record_page_index
    shopping_records = paginate_records(current_api_v1_user.shopping_data.is_finish_true, params)
    total_pages = shopping_records.total_pages
    if shopping_records.blank?
      render_not_found_error
    else
      shopping_records = formatted_shopping_data(shopping_records)
      render json: { records: shopping_records, total_pages: total_pages }
    end
  end

  def search_by_purchase
    # purchase_records = current_api_v1_user.memos.where(purchase_name: params[:word])
    purchase_records = current_api_v1_user.memos.where('purchase_name LIKE(?)', "%#{params[:word]}%")

    if purchase_records.empty?
      render_not_found_error("お買い物履歴")
      return
    elsif purchase_records.present?
      shopping_datum_ids = purchase_records.pluck(:shopping_datum_id)
      shopping_records = current_api_v1_user.shopping_data.is_finish_true.where(id: shopping_datum_ids)
      if shopping_records.empty?
        render_not_found_error("お買い物が終了しているデータの中では記録")
        return
      elsif params[:start_date].present? && params[:end_date].present?
        shopping_records = shopping_records.where(shopping_date: params[:start_date]..params[:end_date])
        if shopping_records.empty?
          render_not_found_error("ご指定いただいた期間でのお買い物履歴")
          return
        end
      elsif params[:start_date].empty? || params[:end_date].empty?
        render_unauthorized_operation("両方の日付を入力してください")
        return
      end
    end

    shopping_records = paginate_records(shopping_records, params)
    total_pages = shopping_records.total_pages
    shopping_records = formatted_shopping_data(shopping_records)
    render json: { records: shopping_records, total_pages: total_pages }
  end

  def search_by_shop_page_index
    shop = current_api_v1_user.shops.find_by(shop_name: params[:word])
    # shop = current_api_v1_user.shops.where('shop_name LIKE(?)', "%#{params[:word]}%")
    if shop.blank?
      render_not_found_error("お店")
      return
    end
    shopping_records = paginate_records(shop.shopping_datum.is_finish_true, params)
    total_pages = shopping_records.total_pages
    if shopping_records.blank?
      render_not_found_error("お買物履歴")
      return
    elsif params[:start_date].present? && params[:end_date].present?
      shopping_records = shopping_records.where(shopping_date: params[:start_date]..params[:end_date])
      if shopping_records.empty?
        render_not_found_error("お買物履歴")
        return
      end
    elsif params[:start_date].empty? || params[:end_date].empty?
      render_unauthorized_operation("両方の日付を入力してください")
      return
    end

    shopping_records = shopping_records.map do |record|
      record.attributes.merge({ 'memos_count': record.memos.count })
    end

    render json: { records: shopping_records, total_pages: total_pages }
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

  def find_shopping_datum_for_query_params
    @shopping_datum = current_api_v1_user.shopping_data.find_by(id: params[:shopping_datum_id])
  end

  def formatted_shopping_data(data)
    data.map do |datum|
      datum.attributes.merge({ 'memos_count': datum.memos.count })
    end
  end

  def paginate_records(record, params)
    record.page((params[:page] || 1)).per(Settings.shopping_datum[:display_limit])
  end
end
