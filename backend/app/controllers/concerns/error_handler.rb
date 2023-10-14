module ErrorHandler
  extend ActiveSupport::Concern

  def render_not_found_error
    render json: { error: 'データが見つかりませんでした' }, status: :not_found
  end
end
