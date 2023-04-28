class Api::V1::Auth::SessionsController < DeviseTokenAuth::SessionsController
  before_action :authenticate_api_key

  private

  def authenticate_api_key
    authenticate_or_request_with_http_token do |token, options|
      token == ENV['API_KEY']
    end
  end
end
