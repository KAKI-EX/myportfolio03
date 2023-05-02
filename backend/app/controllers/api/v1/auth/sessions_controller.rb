class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  before_action :authenticate_api_key

  # ログイン成功時のメッセージもRailsAPIで制御したいためdeviseのcontrollerをオーバーライド。
  def render_create_success
    render json: {
      message: I18n.t('devise.sessions.signed_in'), # この部分を追加した。
      data: resource_data(resource_json: @resource.token_validation_response)
    }
  end

  private

  def authenticate_api_key
    authenticate_or_request_with_http_token do |token, options|
      token == ENV['API_KEY']
    end
  end

  # def render_create_error_bad_credentials
  #   render json: {
  #     errors: I18n.t("sessions.bad_credentials")
  #   }, status: :unauthorized
  # end
end
