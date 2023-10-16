module AuthorizationSpecHelper
  def sign_in(user)
    post "/api/v1/auth/sign_in/",
      params: { email: user[:email], password: "password" },
      headers: { 'Authorization' => "Bearer #{ ENV['API_KEY'] }" },
      as: :json

    response.headers.slice('client', 'access-token', 'uid')
  end
end
