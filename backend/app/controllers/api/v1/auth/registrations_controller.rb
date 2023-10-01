# アカウント作成用コントローラー
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  before_action :ensure_normal_user, only: %i[update destroy]

  def render_create_success
    render json: {
      message: 'アカウントを作成しました',
      status: 'success',
      data:   resource_data
    }
  end

  def ensure_normal_user
    if current_api_v1_user&.email == 'guest@example.com'
      render json: { message: 'ゲストユーザーの更新・削除できません。' }, status: :forbidden
      return
    end
  end

  private

  def sign_up_params
    params.permit(:email, :password, :password_confirmation, :name, :nickname)
  end

  def account_update_params
    params.require(:registration).permit(:name, :email, :password, :password_confirmation, :nickname)
  end
end
