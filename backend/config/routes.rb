Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :okaimono do
        get   'memo/index/:id',           to: 'memos#index'
        post  'memo/create',              to: 'memos#create'
        get   'shoppingdatum/index/:id',  to: 'shopping_datum#index'
        post  'shoppingdatum/create',     to: 'shopping_datum#create'
        get   'shoppingdatum/show',       to: 'shopping_datum#show'
        get   'shops/index/:id',          to: 'shops#index'
        post  'shops/create',             to: 'shops#create'
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
