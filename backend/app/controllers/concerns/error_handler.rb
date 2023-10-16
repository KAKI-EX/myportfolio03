module ErrorHandler
  extend ActiveSupport::Concern

  def render_not_found_error
    render json: { error: 'データが見つかりませんでした' }, status: :not_found
  end

  def render_unprocessable_entity
    render json: { errors: '何らかのエラーにより作成できませんでした' }, status: :unprocessable_entity
  end

  def render_unauthorized_operation
    render json: { error: '不正な操作が実行されました' }, status: :bad_request
  end
end
