# アカウント作成用コントローラー
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController

  def render_create_success
    render json: {
      message: 'アカウントを作成しました',
      status: 'success',
      data:   resource_data
    }
  end

  private

    def sign_up_params
      params.permit(:email, :password, :password_confirmation, :name)
    end
end
