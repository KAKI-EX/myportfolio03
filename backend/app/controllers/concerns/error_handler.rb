module ErrorHandler
  extend ActiveSupport::Concern

  def render_not_found_error(word="データ")
    render json: { error: "#{word}が見つかりませんでした" }, status: :not_found
  end

  def render_unprocessable_entity
    render json: { errors: '何らかのエラーにより作成できませんでした' }, status: :unprocessable_entity
  end

  def render_unauthorized_operation(word="不正な操作が実行されました'")
    render json: { error: word }, status: :bad_request
  end

  def render_not_modified()
    render json: { error: '更新に失敗しました' }, status: :not_modified
  end
end
