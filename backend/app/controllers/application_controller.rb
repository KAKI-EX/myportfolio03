class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  skip_before_action :verify_authenticity_token, if: :devise_controller?, raise: false

  skip_before_action :verify_authenticity_token
  helper_method :current_user, :user_signed_in?

  rescue_from ActionController::ParameterMissing, with: :params_missing

  private

  def params_missing
    render json: { error: 'パラメーターが正しくありません' }, status: :bad_request
  end

end
