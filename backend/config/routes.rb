Rails.application.routes.draw do
  get 'health_check', to: 'health_checks#index'
  namespace :api do
    namespace :v1 do
      namespace :okaimono do
        # get    'memo/index/:id',                                    to: 'memos#index'
        get    'memo/suggestion',                                   to: 'memos#suggestions_index'
        post   'memo/create',                                       to: 'memos#create'
        post   'memo/create_open_memos',                            to: 'memos#create_open_memos'
        get    'memo/show',                                         to: 'memos#show'
        get    'memo/alert_show',                                   to: 'memos#show_alert'
        get    'memo/show_open_memos',                              to: 'memos#show_open_memos'
        get    'memo/show_memo',                                    to: 'memos#show_memo'
        get    'memo/show_open_memo',                               to: 'memos#show_open_memo'
        post   'memo/update',                                       to: 'memos#update'
        post   'memo/update_open_memo',                             to: 'memos#update_open_memo'
        post   'memo/update_open_memos',                            to: 'memos#update_open_memos'
        post   'memo/update_is_display',                            to: 'memos#update_is_display'
        post   'memo/delete',                                       to: 'memos#destroy'
        post   'memo/delete_open_memo',                             to: 'memos#destroy_open_memo'
        get    'shoppingdatum/index',                               to: 'shopping_datum#index'
        post   'shoppingdatum/create',                              to: 'shopping_datum#create'
        get    'shoppingdatum/show',                                to: 'shopping_datum#show'
        get    'shoppingdatum/show_open_memo',                      to: 'shopping_datum#show_open_memo'
        post   'shoppingdatum/update',                              to: 'shopping_datum#update'
        post   'shoppingdatum/update_open_memo',                    to: 'shopping_datum#update_open_memo'
        delete 'shoppingdatum/destroy',                             to: 'shopping_datum#destroy'
        get    'shoppingdatum/record_index',                        to: 'shopping_datum#record_page_index'
        get    'shoppingdatum/search_by_shop',                      to: 'shopping_datum#search_by_shop_page_index'
        get    'shoppingdatum/search_by_purchase',                  to: 'shopping_datum#search_by_purchase'
        get    'shops/index',                                       to: 'shops#index'
        get    'shops/suggestion',                                  to: 'shops#suggestions_index'
        post   'shops/create',                                      to: 'shops#create'
        post   'shops/create_open_memo',                            to: 'shops#create_open_memo'
        get    'shops/show',                                        to: 'shops#show'
        get    'shops/show_open_memo',                              to: 'shops#show_open_memo'
        post   'shops/update',                                      to: 'shops#update'
        delete 'shops/destroy/:id',                                 to: 'shops#destroy'
      end
    end
  end

  namespace :api do
    namespace :v1 do
      namespace :auth do
        devise_scope :api_v1_user do
          post 'sessions/guest_sign_in', to: 'sessions#guest_sign_in'
          get 'sessions/user_nickname', to: 'sessions#user_name_show'
        end
        resources :sessions_check, only: %i[index]
      end

      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations',
        sessions: 'api/v1/auth/sessions'
      }
    end
  end
end
