Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      namespace :okaimono do
        get    'memo/index/:id',                                    to: 'memos#index'
        post   'memo/create',                                       to: 'memos#create'
        get    'memo/show',                                         to: 'memos#show'
        get    'memo/show_open_memo',                               to: 'memos#show_open_memo'
        post   'memo/update',                                       to: 'memos#update'
        post   'memo/delete',                                       to: 'memos#destroy'
        get    'shoppingdatum/index',                               to: 'shopping_datum#index'
        post   'shoppingdatum/create',                              to: 'shopping_datum#create'
        get    'shoppingdatum/show',                                to: 'shopping_datum#show'
        get    'shoppingdatum/show_open_memo',                      to: 'shopping_datum#show_open_memo'
        post   'shoppingdatum/update',                              to: 'shopping_datum#update'
        delete 'shoppingdatum/destroy/:shopping_datum_id',          to: 'shopping_datum#destroy'
        get    'shops/index/:user_id',                              to: 'shops#index'
        post   'shops/create',                                      to: 'shops#create'
        get    'shops/show',                                        to: 'shops#show'
        get    'shops/show_open_memo',                              to: 'shops#show_open_memo'
        post   'shops/update',                                      to: 'shops#update'
        delete 'shops/destroy/:id',                                 to: 'shops#destroy'
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
