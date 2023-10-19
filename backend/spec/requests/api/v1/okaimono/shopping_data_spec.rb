require 'rails_helper'

RSpec.describe "Api::V1::Okaimono::ShoppingDatum", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let(:base_url) { 'http://192.168.0.210/api/v1/okaimono/shoppingdatum' }
  let(:auth) { { 'Authorization' => "#{ ENV['API_KEY'] }" } }

  shared_context 'user_signed_in' do
    before do
      auth_tokens = sign_in(user)
      send(http_method, "#{ base_url }/#{ controller_action }",
      params: defined?(params) ? params : {},
      headers: auth.merge(auth_tokens))
      @json_response = response.body.present? ? JSON.parse(response.body) : response.body
    end
  end

  shared_context 'user_signed_in_with_show' do
    before do
      auth_tokens = sign_in(user)
      send(http_method, "#{ base_url }/#{ controller_action }",
      params: { shopping_datum_id: params },
      headers: auth.merge(auth_tokens))
      @json_response = JSON.parse(response.body)
    end
  end

  shared_context 'without_user_signed_in_with_show_open_memo' do
    before do
      send(http_method, "#{ base_url }/#{ controller_action }",
      params: { user_id: user_id, shopping_datum_id: shopping_datum_id },
      headers: auth)
      @json_response = JSON.parse(response.body)
    end
  end

  shared_examples 'status_code_401_when_unauthenticated_user' do
    it "ステータスコード401であること" do
      get "#{ base_url }/index", headers: auth
      expect(response).to have_http_status(401)
    end
  end

  describe "GET /shopping_datum" do
    describe "#index" do
      let(:http_method) { :get }
      let(:controller_action) { "index" }

      context "ユーザー認証をしている場合" do
        context "メモの登録がある場合" do
          let!(:shop) { create(:shop, user: user) }
          let!(:shopping_datum_with_10memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today) }
          let!(:shopping_datum_with_20memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today - 1.day) }
          let!(:shopping_datum_with_30memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today - 2.day) }
          let!(:memo_count_10) { create_list(:memo, 10, user: user, shop: shop, shopping_datum: shopping_datum_with_10memos) }
          let!(:memo_count_20) { create_list(:memo, 20, user: user, shop: shop, shopping_datum: shopping_datum_with_20memos) }
          let!(:memo_count_30) { create_list(:memo, 30, user: user, shop: shop, shopping_datum: shopping_datum_with_30memos) }
          include_context "user_signed_in"
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
          include_context "user_signed_in"
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
      let!(:shop) { create(:shop, user: user) }

      context "requireが正しく、許可されていないパラメータが送られてきた場合" do
        let!(:correct_attributes) do
          {
            shopping_datum: {
              hogehoge: "hogege",
              user_id: user.id.to_s,
              shop_id: shop.id,
              shopping_date: Date.today.to_s,
              shopping_memo: "#{ Faker::Commerce.department } #{ Faker::Commerce.price } #{ Faker::Commerce.material } ",
              estimated_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              total_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              is_finish: false,
              is_open: false,
            },
          }
        end
        let!(:params) { correct_attributes }
        include_context "user_signed_in"

        it "許可されていないパラメータは除外され、ステータスコード201を返すこと" do
          expect(response).to have_http_status(201)
          expect(@json_response.values).not_to include("hogege")
        end
      end

      context "requireが正しくない場合" do
        let(:incorrect_requiere) do
          {
            hoge: {
              user_id: user.id.to_s,
              shop_id: shop.id,
              shopping_date: Date.today.to_s,
              shopping_memo: "#{ Faker::Commerce.department } #{ Faker::Commerce.price } #{ Faker::Commerce.material } ",
              estimated_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              total_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              is_finish: false,
              is_open: false,
            },
          }
        end
        let!(:params) { incorrect_requiere }
        include_context "user_signed_in"

        it "ステータスコード400を返すこと" do
          expect(response).to have_http_status(400)
        end
      end

      context "バリデーションに引っかかった場合" do
        let(:incorrect_attributes_values) do
          {
            shopping_datum: {
              user_id: "",
              shop_id: "",
              shopping_date: Date.today.to_s,
              shopping_memo: "#{ Faker::Commerce.department } #{ Faker::Commerce.price } #{ Faker::Commerce.material } ",
              estimated_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              total_budget: Faker::Number.between(from: 0, to: 10000).to_s,
              is_finish: false,
              is_open: false,
            },
          }
        end
        let!(:params) { incorrect_attributes_values }
        include_context "user_signed_in"
        it "ステータスコード422を返すこと" do
          expect(response).to have_http_status(422)
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
      let!(:shop) { create(:shop, user: user) }
      include_context "user_signed_in"

      context "shopping_dataが存在しない場合" do
        let!(:params) { "does_not_exist_id" }
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "shopping_dataが存在する場合" do
        let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today) }
        let!(:params) { shopping_datum.id.to_s }
        include_context "user_signed_in_with_show"
        it "登録されているデータを返すこと" do
          expect(@json_response.values).to include(shopping_datum.id.to_s)
        end
      end
    end

    context "ログインをしていない場合" do
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end

  describe "#show_open_memo" do
    let(:http_method) { "get" }
    let(:controller_action) { "show_open_memo" }
    let!(:shop) { create(:shop, user: user) }
    let!(:user_id) { user.id }
    let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: true) }
    context "ログインしていない場合" do
      context "is_openがtrueの場合" do
        let!(:shopping_datum_id) { shopping_datum.id }
        include_context "without_user_signed_in_with_show_open_memo"
        it "shopping_datumを読み込めること" do
          expect(@json_response).not_to include("access-token")
          expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
        end
      end

      context "shopping_datum_idが見つからなかった場合" do
        let!(:user_id) { user.id }
        let!(:shopping_datum_id) { "does_not_exist_this_id" }
        include_context "without_user_signed_in_with_show_open_memo"
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "user_idが見つからなかった場合" do
        let!(:user_id) { "does_not_exist_this_id" }
        let!(:shopping_datum_id) { shopping_datum.id }
        include_context "without_user_signed_in_with_show_open_memo"
        it "ステータスコード404を返すこと" do
          expect(response).to have_http_status(404)
        end
      end

      context "is_openがfalseの場合" do
      let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
      let!(:shopping_datum_id) { shopping_datum.id }
      include_context "without_user_signed_in_with_show_open_memo"
        it "ステータスコード400を返すこと" do
          expect(response).to have_http_status(400)
        end
      end
    end
    context "ログインしている場合" do
      let!(:shopping_datum_id) { shopping_datum.id }
      include_context "without_user_signed_in_with_show_open_memo"
      it "同じくshopping_datumが読み込めること" do
        expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
      end
    end
  end

  describe "#update" do
    let(:http_method) { "post" }
    let(:controller_action) { "update" }
    context "ログインしている場合" do
      let!(:shop) { create(:shop, user: user) }
      let!(:update_target) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today) }
      let!(:dummy_data) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today) }
      let!(:correct_attributes) do
        {shopping_datum:
          {
            shopping_datum_id: update_target.id,
            user_id: user.id.to_s,
            shop_id: shop.id,
            shopping_date: "2050-01-01",
            shopping_memo: "update_test",
            estimated_budget: "99999",
            total_budget: "99999",
            is_finish: true,
            is_open: true,
          }
        }
      end
      let!(:params) { correct_attributes }
      include_context "user_signed_in"
      it "指定通りのshopping_datumが更新されていること" do
        correct_attributes[:shopping_datum].except(:user_id, :shopping_datum_id).each do |key, value|
          expect(@json_response[key.to_s]).to eq(value)
        end
      end
      context "shopping_datumがnilの場合" do
        let!(:wrong_attributes) do
          {shopping_datum:
            {
              shopping_datum_id: "hoge_id",
              user_id: user.id.to_s,
              shop_id: shop.id,
              shopping_date: "2050-01-01",
              shopping_memo: "update_test",
              estimated_budget: "99999",
              total_budget: "99999",
              is_finish: true,
              is_open: true,
            }
          }
        end
        let!(:params) { wrong_attributes }
        include_context "user_signed_in"
        it "例外を起こさず、指定の文字列とステータスコード304を返すこと" do
          expect(response).to have_http_status(304)
        end
      end
    end

    context "ログインをしていない場合" do
      it_behaves_like "status_code_401_when_unauthenticated_user"
    end
  end

  describe "#destroy" do
    let(:http_method) { "delete" }
    let(:controller_action) { "destroy" }

    context "ログインしている場合" do
      let!(:shop) { create(:shop, user: user) }
      let!(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
      let!(:params) { shopping_datum.id }
      include_context "user_signed_in_with_show"
      it "正しい情報が削除されていること" do
        result = ShoppingDatum.find_by(id: shopping_datum.id)
        expect(result).to be_nil
      end

      context "削除できなかった場合" do
        let!(:params) { "does_not_exist_this_id" }
        include_context "user_signed_in_with_show"
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
