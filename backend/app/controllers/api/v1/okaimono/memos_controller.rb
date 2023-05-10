class Api::V1::Okaimono::MemosController < ApplicationController

  def index
    memos = User.find(params[:id]).memos
    render json: memos
  end

  def create
    memos = Memo.new(memo_params)
    if memos.save
      render json: memos
    else
      render json: memos.errors
    end
  end

  private

  def memo_params
    params.require(:memo).permit(
                                  :user_id,
                                  :shop_id,
                                  :shopping_datum_id,
                                  :purchase_name,
                                  :shopping_memo,
                                  :amount,
                                  :price,
                                  :shopping_date,
                                  :memo_type
                                )
  end
end
