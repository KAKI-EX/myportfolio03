require 'rails_helper'

RSpec.describe "Api::V1::Okaimono::Memos", type: :request do
  include ErrorHandler
  let!(:base_url) { 'http://192.168.0.210/api/v1/okaimono/memo' }
  let!(:auth) { { 'Authorization' => "#{ ENV['API_KEY'] }" } }

  shared_context 'request_from_API' do
    # ログインユーザーを表す変数名は"authenticate_user"に統一すること。
    # データの持ち主としてのユーザーを表すときは"user"に統一すること。
    before do
      request_params =
        if defined?(params)
          { purchase_name: params }
        elsif defined?(word) && defined?(start_date) && defined?(end_date)
          { word: word, start_date: start_date, end_date: end_date }
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

  describe "GET /api/v1/okaimono/memos" do
    describe "#suggestions_index" do
      let(:http_method) {:get}
      let(:controller_action) { "suggestion" }

      context "ユーザー認証済みの場合" do
        let(:authenticate_user) { create(:user) }
        let(:shop) { create(:shop, user: authenticate_user) }
        let(:authenticate_user_shopping_datum) {create_list(:shopping_datum_shopping_date, 2, user: authenticate_user, shop: shop, is_finish: "true")}

        context "商品名が「しょうゆ」の場合" do
          let(:correct_purchase_name) { "しょうゆ" }
          let(:wrong_purchase_name) { "みそ" }
          let!(:create_data) {
            authenticate_user_shopping_datum.each do |datum|
              create_memos_with_word_by_diff_purname(shopping_datum: datum, number: 15, word: correct_purchase_name, shop: shop)
            end
            authenticate_user_shopping_datum.each do |datum|
              create_memos_with_word_by_diff_purname(shopping_datum: datum, number: 3, word: wrong_purchase_name, shop: shop)
            end
          }
          let(:params) { "しょ" }
          include_context "request_from_API"
          it "ステータス200を返すこと" do
            expect(response).to have_http_status(200)
          end
          it "「みそ」ではなく「しょうゆ」の商品名を指定個数分だけ返していること" do
            expect(@json_response.length).to eq(Settings.memo[:display_limit])
            @json_response.each do |record|
              expect(record["purchase_name"]).to include(correct_purchase_name)
              expect(record["purchase_name"]).to_not include(wrong_purchase_name)
            end
          end
          it "「みそ」ではなく「しょうゆ」の商品名を指定個数分だけ返していること" do
            expect(@json_response.length).to eq(Settings.memo[:display_limit])
            @json_response.each do |record|
              expect(record["purchase_name"]).to include(correct_purchase_name)
              expect(record["purchase_name"]).to_not include(wrong_purchase_name)
            end
          end
          it "要素名はidとpurchase_nameであること" do
            expect(@json_response[0].keys).to eq(["id", "purchase_name"])
          end
          context "paramsがblankだった場合" do
            let(:params) { "" }
            include_context "request_from_API"
            it "notfoundを返すこと" do
              expect(response).to have_http_status(400)
            end
          end
        end
        context "商品名が同一である場合" do
          let(:correct_purchase_name) { "しょうゆ" }
          let(:params) { "しょ" }
          let!(:create_data) {
            authenticate_user_shopping_datum.each do |datum|
              create_memos_with_word_by_same_purname(shopping_datum: datum, number: 15, word: correct_purchase_name, shop: shop)
            end
          }
          include_context "request_from_API"
          it "重複は削除され、一つのデータのみを返すこと" do
            expect(@json_response.length).to eq(1)
          end
        end
        context "検索結果が見つからない場合" do
          let(:params) { "hoge" }
          include_context "request_from_API"
          it "何も返さないこと" do
            expect(@json_response.blank?).to be_truthy
          end
        end
      end
    end
  end

  private

  def create_memos_with_word_by_same_purname(shopping_datum:, number:, word:, shop: authenticate_user_shop)
    FactoryBot.create_list(
      :memo,
      number,
      user: authenticate_user,
      shop: shop,
      shopping_datum: shopping_datum,
      purchase_name: "#{correct_purchase_name} #{Faker::Commerce.product_name}"
    )
  end

  def create_memos_with_word_by_diff_purname(shopping_datum:, number:, word:, shop: authenticate_user_shop)
    FactoryBot.create_list(
      :diff_by_purchase_name,
      number,
      user: authenticate_user,
      shop: shop,
      shopping_datum: shopping_datum,
      custom_purchase_name: defined?(word) ? word : nil
    )
  end

  def create_memos_without_word(shopping_datum:, number:, shop: authenticate_user_shop)
    FactoryBot.create_list(
      :memo,
      number,
      user: authenticate_user,
      shop: shop,
      shopping_datum: shopping_datum,
      purchase_name: Faker::Commerce.product_name
    )
  end
end
