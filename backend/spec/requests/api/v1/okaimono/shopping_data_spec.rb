require 'rails_helper'

RSpec.describe "Api::V1::Okaimono::ShoppingDatum", type: :request do

  let!(:user) { FactoryBot.create(:user) }
  let(:base_url) { 'http://192.168.0.210/api/v1/okaimono/shoppingdatum' }
  let(:auth) {{ 'Authorization' => "#{ENV['API_KEY']}" }}

  describe "GET /shopping_datum" do
    describe "#index" do
      context "ユーザー認証している場合" do
        context "メモの登録がある場合" do
          let!(:shop) { create(:shop, user: user) }
          let!(:shopping_datum_with_10memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today) }
          let!(:shopping_datum_with_20memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today - 1.day) }
          let!(:shopping_datum_with_30memos) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today - 2.day) }
          let!(:memo_count_10) { create_list(:memo, 10, user: user, shop: shop, shopping_datum: shopping_datum_with_10memos) }
          let!(:memo_count_20) { create_list(:memo, 20, user: user, shop: shop, shopping_datum: shopping_datum_with_20memos) }
          let!(:memo_count_30) { create_list(:memo, 30, user: user, shop: shop, shopping_datum: shopping_datum_with_30memos) }

          before do
            auth_tokens = sign_in(user)
            get "#{base_url}/index", headers: auth.merge(auth_tokens)
            @json_response = JSON.parse(response.body)
          end

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
          before do
            auth_tokens = sign_in(user)
            get "#{base_url}/index", headers: auth.merge(auth_tokens)
            @json_response = JSON.parse(response.body)
          end

          it "指定のエラーメッセージが返されていること" do
            expect(@json_response["error"]).to eq("データが見つかりませんでした")
            expect(response.status).to eq(404)
          end
        end
      end

      context "ユーザー認証していない場合" do
        it "ステータスコード401であること" do
          get "#{base_url}/index", headers: auth
          expect(response).to have_http_status(401)
        end
      end
    end
  end

  describe "#record_index" do
    
  end

end
