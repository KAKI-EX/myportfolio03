require 'rails_helper'

RSpec.describe "Api::V1::Okaimono::ShoppingDatum", type: :request do
  let(:base_url) { 'http://192.168.0.210/api/v1/okaimono/shoppingdatum' }
  let(:auth) { { 'Authorization' => "#{ ENV['API_KEY'] }" } }

  shared_context 'request_from_API' do
    # ログインユーザーを表す変数名は"authenticate_user"に統一すること。
    # データの持ち主としてのユーザーを表すときは"user"に統一すること。
    before do
      request_params =
        if defined?(params)
          params
        elsif defined?(shopping_datum_id)
        #クエリパラメータの使用を想定。
          { shopping_datum_id: shopping_datum_id }
        elsif defined?(query_user_id) && defined?(query_shopping_datum_id)
        #クエリパラメータの使用を想定。
          { user_id: query_user_id, shopping_datum_id: query_shopping_datum_id }
        else
          {}
        end
      defined?(authenticate_user) ? (auth_tokens = sign_in(authenticate_user)) : {}
      send(http_method, "#{ base_url }/#{ controller_action }",
      params: request_params,
      headers: defined?(authenticate_user) ? auth.merge(auth_tokens) : auth)
      @json_response = response.body.present? ? JSON.parse(response.body) : response.body
    end
  end

  shared_examples 'status_code_401_when_unauthenticated_user' do
    include_context "request_from_API"
    it "ステータスコード401であること" do
      expect(response).to have_http_status(401)
    end
  end

  describe "GET /shopping_datum" do
    describe "#index" do
      let(:http_method) { :get }
      let(:controller_action) { "index" }

      context "ユーザー認証をしている場合" do
        let!(:authenticate_user) { FactoryBot.create(:user) }
        context "メモの登録がある場合" do
          let!(:shop) { create(:shop, user: authenticate_user) }
          let!(:shopping_datum_with_10memos) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today) }
          let!(:shopping_datum_with_20memos) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today - 1.day) }
          let!(:shopping_datum_with_30memos) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today - 2.day) }
          let!(:memo_count_10) { create_list(:memo, 10, user: authenticate_user, shop: shop, shopping_datum: shopping_datum_with_10memos) }
          let!(:memo_count_20) { create_list(:memo, 20, user: authenticate_user, shop: shop, shopping_datum: shopping_datum_with_20memos) }
          let!(:memo_count_30) { create_list(:memo, 30, user: authenticate_user, shop: shop, shopping_datum: shopping_datum_with_30memos) }
          include_context "request_from_API"
          it "ステータスコード200であること" do
            expect(response).to have_http_status(200)
          end
          it "shopping_datumが3件あること" do
            expect(@json_response.length).to eq(3)
          end

          context "降順であることを確認" do
            it "ハッシュ0のmemos_countが10であること" do
              expect(@json_response[0]["memos_count"]).to eq(10)
            end
            it "ハッシュ1のmemos_countが20であること" do
              expect(@json_response[1]["memos_count"]).to eq(20)
            end
            it "ハッシュ2のmemos_countが30であること" do
              expect(@json_response[2]["memos_count"]).to eq(30)
            end
          end
        end

        context "メモの登録がない場合" do
          include_context "request_from_API"
          it "指定のエラーメッセージが返されていること" do
            expect(response).to have_http_status(204)
          end
        end
      end

      context "ログインしていない場合" do
        it_behaves_like "status_code_401_when_unauthenticated_user"
      end
    end
  end

  describe "#create" do
    let(:http_method) { "post" }
    let(:controller_action) { "create" }

    context "ユーザー認証をしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: authenticate_user) }

      context "requireが正しく、許可されていないパラメータが送られてきた場合" do
        let(:params) do
          {
            defined?(set_require) ? set_require : :shopping_datum => {
              hogehoge: "hogege",
              user_id: defined?(set_user) ? set_user : authenticate_user.id.to_s,
              shop_id: defined?(set_shop) ? set_shop : shop.id,
              shopping_date: Date.today.to_s,
              shopping_memo: "#{ Faker::Commerce.department } #{ Faker::Commerce.price } #{ Faker::Commerce.material } ",
              estimated_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              total_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              is_finish: false,
              is_open: false,
            },
          }
        end
        include_context "request_from_API"

        it "許可されていないパラメータは除外され、ステータスコード201を返すこと" do
          expect(response).to have_http_status(201)
          expect(@json_response.values).not_to include("hogege")
        end

        context "requireが正しくない場合" do
          let(:set_require) { :hoge }
          include_context "request_from_API"

          it "ステータスコード400を返すこと" do
            expect(response).to have_http_status(400)
          end
        end
        context "バリデーションに引っかかった場合" do
          let(:set_user) { "" }
          let(:set_shop) { "" }
          include_context "request_from_API"
          it "ステータスコード422を返すこと" do
            expect(response).to have_http_status(422)
          end
        end
      end
    end

    context "ユーザー認証していない場合" do
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end

  describe "#show" do
    let(:http_method) { "get" }
    let(:controller_action) { "show" }

    context "ユーザー認証をしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: authenticate_user) }
      let!(:shopping_datum) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today) }
      include_context "request_from_API"

      context "shopping_dataが存在しない場合" do
        let!(:shopping_datum_id) { "does_not_exist_id" }
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "shopping_dataが存在する場合" do
        let!(:shopping_datum_id) { shopping_datum.id.to_s }
        include_context "request_from_API"
        it "登録されているデータを返すこと" do
          expect(@json_response.values).to include(shopping_datum.id.to_s)
        end
      end
    end

    context "ログインをしていない場合" do
      let!(:shopping_datum_id) { "hoge" }
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end

  describe "#show_open_memo" do
    let(:http_method) { "get" }
    let(:controller_action) { "show_open_memo" }
    context "ログインしていない場合" do
      let!(:user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: user) }
      let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: true) }

      context "is_openがtrueの場合" do
        let!(:query_user_id) { user.id }
        let!(:query_shopping_datum_id) { shopping_datum.id }
        include_context "request_from_API"
        it "shopping_datumを読み込めること" do
          expect(@json_response).not_to include("access-token")
          expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
        end
      end

      context "shopping_datum_idが見つからなかった場合" do
        let!(:query_user_id) { user.id }
        let!(:query_shopping_datum_id) { "does_not_exist_this_id" }
        include_context "request_from_API"
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "user_idが見つからなかった場合" do
        let!(:query_user_id) { "does_not_exist_this_id" }
        let!(:query_shopping_datum_id) { shopping_datum.id }
        include_context "request_from_API"
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "is_openがfalseの場合" do
        let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
        let!(:query_user_id) { user.id }
        let!(:query_shopping_datum_id) { shopping_datum.id }
        include_context "request_from_API"
        it "ステータスコード400を返すこと" do
          expect(response).to have_http_status(400)
        end
      end
    end
    context "ログインしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: user) }
      let!(:query_user_id) { user.id }
      let(:query_shopping_datum_id) { shopping_datum.id }
      context "is_openがtrueの場合" do
        let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: true) }
        include_context "request_from_API"
        it "同じくshopping_datumが読み込めること" do
          expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
        end
      end
      context "is_openがfalseの場合" do
        let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
        include_context "request_from_API"
        it "ステータスコード400を返すこと" do
          expect(response).to have_http_status(400)
        end
      end
    end
  end

  describe "#update" do
    let(:http_method) { "post" }
    let(:controller_action) { "update" }
    context "ログインしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: authenticate_user) }
      let!(:update_target) { create(:shopping_datum, user: authenticate_user, shop: shop) }
      let!(:dummy_data) { create(:shopping_datum, user: authenticate_user, shop: shop) }
      let!(:params) do
        {shopping_datum:
          {
            shopping_datum_id: defined?(wrong_shopping_datum_id) ? wrong_shopping_datum_id : update_target.id,
            user_id: authenticate_user.id.to_s,
            shop_id: shop.id,
            shopping_date: "2050-01-01",
            shopping_memo: "update_test",
            estimated_budget: "99999",
            total_budget: defined?(wrong_total_budget) ? wrong_total_budget : "99999",
            is_finish: true,
            is_open: true,
          }
        }
      end
      include_context "request_from_API"
      it "指定通りのshopping_datumが更新されていること" do
        params[:shopping_datum].each do |n|
          dummy_data.attributes.except("user_id", "shop_id").each do |dummy|
            expect(@json_response.values).to include(n[1])
            expect(@json_response).not_to include(dummy)
          end
        end
      end
      context "shopping_datumがnilの場合" do
        let(:wrong_shopping_datum_id) {"hoge"}
        include_context "request_from_API"
        it "例外を起こさず、指定の文字列とステータスコード304を返すこと" do
          expect(response).to have_http_status(304)
        end
      end
      context "バリデーションに引っかかった場合場合" do
        let(:wrong_total_budget) {"hoge"}
        include_context "request_from_API"
        it "例外を起こさず、指定の文字列とステータスコード304を返すこと" do
          expect(response).to have_http_status(304)
        end
      end
    end

    context "ログインをしていない場合" do
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end

  describe "#update_open_memo" do
    let(:http_method) { "post" }
    let(:controller_action) { "update_open_memo" }
    context "ログインしていない場合" do
      let(:user) { FactoryBot.create(:user) }
      let(:shop) { FactoryBot.create(:shop, user: user) }
      let!(:update_target) { FactoryBot.create(:shopping_datum, user: user, shop: shop) }
      let!(:dummy_data) { FactoryBot.create(:shopping_datum, user: user, shop: shop) }
      let(:params) do
        {shopping_datum:
          {
            shopping_datum_id: defined?(wrong_shopping_datum_id) ? wrong_shopping_datum_id : update_target.id,
            user_id: defined?(wrong_user_id) ? wrong_user_id : user.id.to_s,
            shop_id: shop.id,
            shopping_date: "2050-01-01",
            shopping_memo: "update_test",
            estimated_budget: defined?(wrong_estimated_budget) ? wrong_estimated_budget : "99999",
            total_budget: "99999",
            is_finish: !update_target.is_finish,
            is_open: !update_target.is_open,
          }
        }
      end
      include_context "request_from_API"
      it "該当のデータをアップデートできること" do
        params[:shopping_datum].each do |n|
          dummy_data.attributes.except("user_id", "shop_id").each do |dummy|
            expect(@json_response.values).to include(n[1]) #update_targetの中にはshopping_datum_idの要素名は無いためvaluesで比較。
            expect(@json_response).not_to include(dummy)
          end
        end
        expect(response).to have_http_status(200)
      end

      context "ユーザーIDがnilまたは見つからない場合" do
        context "nilの場合" do
          let!(:wrong_user_id) {""}
          include_context "request_from_API"
          it "例外を起こさずステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end

        context "見つからない場合" do
          let!(:wrong_user_id) {"hoge"}
          include_context "request_from_API"
          it "例外を起こさずステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end
      end

      context "shopping_datum_idがnilまたは見つからないの場合" do
        let(:wrong_shopping_datum_id) {""}
        include_context "request_from_API"
        context "nilの場合" do
          it "例外を起こさず、ステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end
        context "見つからない場合" do
          let(:wrong_shopping_datum_id) {"hoge"}
          include_context "request_from_API"
          it "例外を起こさず、ステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end
      end

      context "バリデーションに引っかかった場合" do
        let(:wrong_estimated_budget) { "hoge" }
        include_context "request_from_API"
        it "例外を起こさず、ステータスコード304を返すこと" do
          expect(response).to have_http_status(304)
        end
      end
    end

    context "ログインしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: authenticate_user) }
      let!(:update_target) { create(:shopping_datum, user: authenticate_user, shop: shop) }
      let!(:dummy_data) { create(:shopping_datum, user: authenticate_user, shop: shop) }
      let!(:params) do
        {shopping_datum:
          {
            shopping_datum_id: update_target.id,
            user_id: authenticate_user.id.to_s,
            shop_id: shop.id,
            shopping_date: "2050-01-01",
            shopping_memo: "authenticate_user_with_update_open_memo",
            estimated_budget: "99999",
            total_budget:"99999",
            is_finish: true,
            is_open: true,
          }
        }
      end
      include_context "request_from_API"
      it "ログインしていない状態と同じく、アップデートができること" do
        params[:shopping_datum].each do |n|
          expect(@json_response.values).to include(n[1]) #update_targetの中にはshopping_datum_idの要素名は無いためvaluesで比較。
          expect(response).to have_http_status(200)
        end
      end
    end
  end


  describe "#destroy" do
    let(:http_method) { "delete" }
    let(:controller_action) { "destroy" }

    context "ログインしている場合" do
      let!(:authenticate_user) { FactoryBot.create(:user) }
      let!(:shop) { create(:shop, user: authenticate_user) }
      let!(:shopping_datum) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today) }
      let!(:shopping_datum_id) { shopping_datum.id }
      include_context "request_from_API"
      it "正しい情報が削除されていること" do
        result = ShoppingDatum.find_by(id: shopping_datum.id)
        expect(result).to be_nil
      end

      context "削除できなかった場合" do
        let!(:params) { "does_not_exist_this_id" }
        include_context "request_from_API"
        it "エラーメッセージを返すこと" do
          expect(response).to have_http_status(404)
        end
      end
    end

    context "ログインしていない場合" do
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end
end
