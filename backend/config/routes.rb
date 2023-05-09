Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :okaimono do
        post '/api/v1/okaimono/:id', to: 'posts#show'
        post '/api/v1/okaimono/create', to: 'posts#create'
      end
    end
  end
  namespace :api do
    namespace :v1 do
      resources :test, only: %i[index]

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations',
        sessions: 'api/v1/auth/sessions'
      }

      namespace :auth do
        resources :sessions_check, only: %i[index]
      end
    end
  end
end
