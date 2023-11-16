require 'rails_helper'

RSpec.describe "Api::V1::Okaimono::ShoppingDatum", type: :request do
  include ErrorHandler
  let!(:base_url) { 'http://192.168.0.210/api/v1/okaimono/shoppingdatum' }
  let!(:auth) { { 'Authorization' => "#{ ENV['API_KEY'] }" } }

  shared_context 'request_from_API' do
    # ログインユーザーを表す変数名は"authenticate_user"に統一すること。
    # データの持ち主としてのユーザーを表すときは"user"に統一すること。
    before do
      request_params =
        if defined?(params)
          params
        elsif defined?(shopping_datum_id)
          # クエリパラメータの使用を想定。
          { shopping_datum_id: shopping_datum_id }
        elsif defined?(query_user_id) && defined?(query_shopping_datum_id)
          # クエリパラメータの使用を想定。
          { user_id: query_user_id, shopping_datum_id: query_shopping_datum_id }
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
              expect(@json_response[0]["memos_count"]).to eq(shopping_datum_with_10memos.memos.length)
            end
            it "ハッシュ1のmemos_countが20であること" do
              expect(@json_response[1]["memos_count"]).to eq(shopping_datum_with_20memos.memos.length)
            end
            it "ハッシュ2のmemos_countが30であること" do
              expect(@json_response[2]["memos_count"]).to eq(shopping_datum_with_30memos.memos.length)
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

    describe "#create" do
      let(:http_method) { "post" }
      let(:controller_action) { "create" }

      context "ユーザー認証をしている場合" do
        let(:authenticate_user) { FactoryBot.create(:user) }
        let(:shop) { create(:shop, user: authenticate_user) }

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
        let(:authenticate_user) { FactoryBot.create(:user) }
        let(:shop) { create(:shop, user: authenticate_user) }
        let(:shopping_datum) { create(:shopping_datum, user: authenticate_user, shop: shop, shopping_date: Date.today) }
        include_context "request_from_API"

        context "shopping_dataが存在しない場合" do
          let(:shopping_datum_id) { "does_not_exist_id" }
          it "ステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end

        context "shopping_dataが存在する場合" do
          let(:shopping_datum_id) { shopping_datum.id.to_s }
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
        let(:user) { FactoryBot.create(:user) }
        let(:shop) { create(:shop, user: user) }
        let(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: true) }

        context "is_openがtrueの場合" do
          let(:query_user_id) { user.id }
          let(:query_shopping_datum_id) { shopping_datum.id }
          include_context "request_from_API"
          it "shopping_datumを読み込めること" do
            expect(@json_response).not_to include("access-token")
            expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
          end
        end

        context "shopping_datum_idが見つからなかった場合" do
          let(:query_user_id) { user.id }
          let(:query_shopping_datum_id) { "does_not_exist_this_id" }
          include_context "request_from_API"
          it "ステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end

        context "user_idが見つからなかった場合" do
          let(:query_user_id) { "does_not_exist_this_id" }
          let(:query_shopping_datum_id) { shopping_datum.id }
          include_context "request_from_API"
          it "ステータスコード404を返すこと" do
            expect(response).to have_http_status(404)
          end
        end

        context "is_openがfalseの場合" do
          let(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
          let(:query_user_id) { user.id }
          let(:query_shopping_datum_id) { shopping_datum.id }
          include_context "request_from_API"
          it "ステータスコード400を返すこと" do
            expect(response).to have_http_status(400)
          end
        end
      end
      context "ログインしている場合" do
        let(:authenticate_user) { FactoryBot.create(:user) }
        let(:user) { FactoryBot.create(:user) }
        let(:shop) { create(:shop, user: user) }
        let(:query_user_id) { user.id }
        let(:query_shopping_datum_id) { shopping_datum.id }
        context "is_openがtrueの場合" do
          let(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: true) }
          include_context "request_from_API"
          it "同じくshopping_datumが読み込めること" do
            expect(@json_response.values).to include(shopping_datum.id.to_s && shopping_datum.shopping_memo)
          end
        end
        context "is_openがfalseの場合" do
          let(:shopping_datum) { create(:shopping_datum, user: user, shop: shop, shopping_date: Date.today, is_open: false) }
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
        let(:authenticate_user) { FactoryBot.create(:user) }
        let(:shop) { create(:shop, user: authenticate_user) }
        let(:update_target) { create(:shopping_datum, user: authenticate_user, shop: shop) }
        let(:dummy_data) { create(:shopping_datum, user: authenticate_user, shop: shop) }
        let(:params) do
          {
            shopping_datum:
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
                        },
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
          let(:wrong_shopping_datum_id) { "hoge" }
          include_context "request_from_API"
          it "例外を起こさず、指定の文字列とステータスコード304を返すこと" do
            expect(response).to have_http_status(304)
          end
        end
        context "バリデーションに引っかかった場合場合" do
          let(:wrong_total_budget) { "hoge" }
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
          {
            shopping_datum:
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
                        },
          }
        end
        include_context "request_from_API"
        it "該当のデータをアップデートできること" do
          params[:shopping_datum].each do |n|
            dummy_data.attributes.except("user_id", "shop_id").each do |dummy|
              expect(@json_response.values).to include(n[1]) # update_targetの中にはshopping_datum_idの要素名は無いためvaluesで比較。
              expect(@json_response).not_to include(dummy)
            end
          end
          expect(response).to have_http_status(200)
        end

        context "ユーザーIDがnilまたは見つからない場合" do
          context "nilの場合" do
            let!(:wrong_user_id) { "" }
            include_context "request_from_API"
            it "例外を起こさずステータスコード404を返すこと" do
              expect(response).to have_http_status(404)
            end
          end

          context "見つからない場合" do
            let!(:wrong_user_id) { "hoge" }
            include_context "request_from_API"
            it "例外を起こさずステータスコード404を返すこと" do
              expect(response).to have_http_status(404)
            end
          end
        end

        context "shopping_datum_idがnilまたは見つからないの場合" do
          let(:wrong_shopping_datum_id) { "" }
          include_context "request_from_API"
          context "nilの場合" do
            it "例外を起こさず、ステータスコード404を返すこと" do
              expect(response).to have_http_status(404)
            end
          end
          context "見つからない場合" do
            let(:wrong_shopping_datum_id) { "hoge" }
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
          {
            shopping_datum:
                        {
                          shopping_datum_id: update_target.id,
                          user_id: authenticate_user.id.to_s,
                          shop_id: shop.id,
                          shopping_date: "2050-01-01",
                          shopping_memo: "authenticate_user_with_update_open_memo",
                          estimated_budget: "99999",
                          total_budget: "99999",
                          is_finish: true,
                          is_open: true,
                        },
          }
        end
        include_context "request_from_API"
        it "ログインしていない状態と同じく、アップデートができること" do
          params[:shopping_datum].each do |n|
            expect(@json_response.values).to include(n[1]) # update_targetの中にはshopping_datum_idの要素名は無いためvaluesで比較。
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

    describe "#record_page_index" do
      let(:http_method) { "get" }
      let(:controller_action) { "record_index" }
      context "ログインしている場合" do
        let!(:authenticate_user) { FactoryBot.create(:user) }
        let!(:shop) { FactoryBot.create(:shop, user: authenticate_user) }
        context "shopping_datumのis_finish:trueが11つあった場合" do
          let!(:shopping_datum) { FactoryBot.create_list(:shopping_datum, 11, user: authenticate_user, shop: shop, is_finish: "true") }
          let!(:shopping_datum_dummy) { FactoryBot.create_list(:shopping_datum, 11, user: authenticate_user, shop: shop, is_finish: "false") }
          include_context "request_from_API"
          it "is_finish: falseは存在しないこと" do
            @json_response["records"].map do |record|
              expect(record["is_finish"]).to eq(true)
            end
          end
          it "total_pagesの値は、is_finish:trueの検索数/display_limitであること。（テスト作成時、desplay_limitは「5」、11/5 = 2.2で3でパス）" do
            expecting_total_pages = (shopping_datum.length.to_f / Settings.shopping_datum[:display_limit].to_f).ceil
            expect(@json_response["total_pages"]).to eq(expecting_total_pages)
          end
        end
        context "shopping_datumが存在しない場合" do
          include_context "request_from_API"
          it "ステータスコード404と指定の文字列を返すこと" do
            expect(response).to have_http_status(404)
            expect(@json_response.values[0]).to eq("データが見つかりませんでした")
          end
        end
      end
      context "ログインしていない場合" do
        it_behaves_like "status_code_401_when_unauthenticated_user"
      end
    end

    describe "#search_by_purchase" do
      let(:http_method) { "get" }
      let(:controller_action) { "search_by_purchase" }

      context "ログインしている場合" do
        let(:authenticate_user) { FactoryBot.create(:user, name: "auth_user") }
        let(:dummy_user) { FactoryBot.create(:user) }
        let(:authenticate_user_shop) { FactoryBot.create(:shop, user: authenticate_user) }
        let(:dummy_user_shop) { FactoryBot.create(:shop, user: dummy_user) }
        context "検索期間の指定が正しい場合" do
          let(:auth_user_shopping_datum_records_with_true) { FactoryBot.create_list(:shopping_datum_shopping_date, 15, user: authenticate_user, shop: authenticate_user_shop, is_finish: "true") }
          let(:auth_user_shopping_datum_records_with_false) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_shop, is_finish: "false") }
          let(:dummy_user_shopping_datum_records) { FactoryBot.create_list(:shopping_datum_shopping_date, 6, user: dummy_user, shop: dummy_user_shop, is_finish: true) }
          let(:start_date) { Date.today }
          let(:end_date) { Date.today + 10 }
          context "検索ワード「しょうゆ」の場合" do
            let(:word) { "しょうゆ" }
            let!(:create_data) do
              auth_user_shopping_datum_records_with_true.each do |datum|
                create_memos_with_word(shopping_datum: datum, number: 2)
                create_memos_without_word(shopping_datum: datum, number: 2)
              end
              auth_user_shopping_datum_records_with_false.each do |datum|
                create_memos_with_word(shopping_datum: datum, number: 2)
                create_memos_without_word(shopping_datum: datum, number: 2)
              end
            end
            before do
              FactoryBot.rewind_sequences
            end
            include_context "request_from_API"
            it "指摘期間内の該当の商品のみ値を返し、降順に並んでいること" do
              date_range = start_date..end_date
              selected_date = auth_user_shopping_datum_records_with_true.select do |record|
                record_date = Date.parse(record.shopping_date)
                # record_date >=start_date && record_date <= end_date
                date_range.cover?(record_date)
              end

              sorted_date = selected_date.map(&:shopping_date).sort.reverse.max(Settings.shopping_datum[:display_limit])
              sorted_date.each_with_index do |datum, index|
                expect(@json_response["records"][index]["shopping_date"]).to eq(datum)
              end
            end
            it "is_finish: falseのデータが含まれていないこと" do
              ids = auth_user_shopping_datum_records_with_false.map(&:id)
              @json_response["records"].each do |record|
                expect(ids).not_to include(record["id"])
              end
            end
            context "memosがそれぞれのshopping_datumに2件ある場合" do
              it "total_pageは検索結果/5の値(繰り上げ)、5つのハッシュデータであること" do
                cal = auth_user_shopping_datum_records_with_true.length.to_f / Settings.shopping_datum[:display_limit]
                total_pages = cal < 1 ? 1 : cal.ceil
                expect(total_pages).to eq(@json_response["total_pages"])
                expect(Settings.shopping_datum[:display_limit]).to eq(@json_response["records"].length)
              end
              it "各shoppig_datumのmemos_countは2であること" do
                @json_response["records"].each do |datum|
                  expect(auth_user_shopping_datum_records_with_true.first.memos.count).to eq(datum["memos_count"])
                end
              end
            end
          end
          context "検索結果が見つからない場合" do
            let(:word) { "hoge" }
            let(:auth_user_shopping_datum_records_with_true) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_shop, is_finish: "true") }
            before do
              auth_user_shopping_datum_records_with_true.each do |datum|
                create_memos_without_word(shopping_datum: datum, number: 2)
              end
            end
            include_context "request_from_API"
            it "ステータスコード404と共に指定の文字列を返すこと" do
              expect(response).to have_http_status(404)
              expect(@json_response.values[0]).to eq("お買い物履歴が見つかりませんでした")
            end
          end
        end
        context "検索期間の指定が正しくない場合" do
          let(:auth_user_shopping_datum_records_with_true) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_shop, is_finish: "true") }
          let!(:create_data) do
            auth_user_shopping_datum_records_with_true.each do |datum|
              create_memos_with_word(shopping_datum: datum, number: 2)
            end
          end
          before do
            FactoryBot.rewind_sequences
          end

          context "検索ワード「しょうゆ」の場合" do
            let(:word) { "しょうゆ" }
            let(:start_date) { Date.today }
            let(:end_date) { Date.today + 2 }
            include_context "request_from_API"
            context "期間がどちらか一方しか入力されていない場合" do
              context "startしか入力されていない場合" do
                let(:start_date) { Date.today }
                let(:end_date) { "" }
                include_context "request_from_API"
                it "ステータスコード400と指定のメッセージを返すこと" do
                  expect(response).to have_http_status(400)
                  expect(@json_response.values[0]).to eq("両方の日付を入力してください")
                end
              end
              context "endしか入力されていない場合" do
                let(:start_date) { "" }
                let(:end_date) { Date.today }
                include_context "request_from_API"
                it "ステータスコード400と指定のメッセージを返すこと" do
                  expect(response).to have_http_status(400)
                  expect(@json_response.values[0]).to eq("両方の日付を入力してください")
                end
              end
              context "指定期間での検索結果が見つからなかった場合" do
                let(:start_date) { "9999-01-01" }
                let(:end_date) { "9999-01-02" }
                include_context "request_from_API"
                it "ステータスコード404と指定の文字列を返すこと" do
                  expect(response).to have_http_status(404)
                  expect(@json_response.values[0]).to eq("ご指定いただいた期間でのお買い物履歴が見つかりませんでした")
                end
              end
            end
          end
        end
      end
      context "ログインをしていない場合" do
        it_behaves_like "status_code_401_when_unauthenticated_user"
      end
    end

    describe "#search_by_shop_page_index" do
      let(:http_method) { "get" }
      let(:controller_action) { "search_by_shop" }
      context "ログインしている場合" do
        let(:authenticate_user) { FactoryBot.create(:user, name: "auth_user") }
        let(:dummy_user) { FactoryBot.create(:user) }
        let(:authenticate_user_test_shop) { FactoryBot.create(:shop, user: authenticate_user, shop_name: "test_shop") }
        let(:authenticate_user_other_shop) { FactoryBot.create(:shop, user: authenticate_user, shop_name: "other_shop") }
        let(:dummy_user_shop) { FactoryBot.create(:shop, user: dummy_user, shop_name: "dummy_shop") }
        context "検索期間の指定が正しい場合" do
          let(:auth_user_shopping_datum_records_with_true_test_shop) do
            FactoryBot.create_list(:shopping_datum_shopping_date, 7, user: authenticate_user, shop: authenticate_user_test_shop, is_finish: "true")
          end
          let(:auth_user_shopping_datum_records_with_true_other_shop) do
            FactoryBot.create_list(:shopping_datum_shopping_date, 7, user: authenticate_user, shop: authenticate_user_other_shop, is_finish: "true")
          end
          let(:auth_user_shopping_datum_records_with_false) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_test_shop, is_finish: "false") }
          let(:dummy_user_shopping_datum_records) { FactoryBot.create_list(:shopping_datum_shopping_date, 6, user: dummy_user, shop: dummy_user_shop, is_finish: true) }
          let(:start_date) { Date.today }
          let(:end_date) { Date.today + 10 }
          context "検索ワードが「test_shop」の場合" do
            let(:word) { "test_shop" }
            let!(:create_data) do
              auth_user_shopping_datum_records_with_true_test_shop.each do |datum|
                create_memos_with_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
                create_memos_without_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
              end
              auth_user_shopping_datum_records_with_true_test_shop.each do |datum|
                create_memos_with_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
                create_memos_without_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
              end
            end
            before do
              FactoryBot.rewind_sequences
            end
            include_context "request_from_API"
            it "指定期間内の該当の店舗での買い物のみの値を返し、降順に並んでいること" do
              date_range = start_date..end_date
              selected_date = auth_user_shopping_datum_records_with_true_test_shop.select do |record|
                record_date = Date.parse(record.shopping_date)
                date_range.cover?(record_date)
              end
              sorted_date = selected_date.map(&:shopping_date).sort.reverse.max(Settings.shopping_datum[:display_limit])
              sorted_date.each_with_index do |datum, index|
                expect(@json_response["records"][index]["shopping_date"]).to eq(datum)
              end
            end
            it "is_finish: falseのデータが含まれていないこと" do
              is_finish_values = @json_response["records"].map { |record| record["is_finish"] }
              expect(is_finish_values).not_to include(false)
            end
            context "memosがそれぞれのshopping_datumに2件ある場合" do
              it "total_pageは検索結果/5の値(繰り上げ)、5つのハッシュデータであること" do
                cal = auth_user_shopping_datum_records_with_true_test_shop.length.to_f / Settings.shopping_datum[:display_limit]
                total_pages = cal < 1 ? 1 : cal.ceil
                expect(total_pages).to eq(@json_response["total_pages"])
                expect(Settings.shopping_datum[:display_limit]).to eq(@json_response["records"].length)
              end
              it "各shoppig_datumのmemos_countは2であること" do
                @json_response["records"].each do |datum|
                  expect(auth_user_shopping_datum_records_with_true_test_shop.first.memos.count).to eq(datum["memos_count"])
                end
              end
            end
          end
          context "検索結果が見つからない場合" do
            let(:word) { "hoge" }
            # let(:auth_user_shopping_datum_records_with_true) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_shop, is_finish: "true") }
            before do
              auth_user_shopping_datum_records_with_true_test_shop.each do |datum|
                create_memos_without_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
              end
            end
            include_context "request_from_API"
            it "ステータスコード404と共に指定の文字列を返すこと" do
              expect(response).to have_http_status(404)
              expect(@json_response.values[0]).to eq("お店が見つかりませんでした")
            end
          end
        end
        context "検索期間の指定が正しくない場合" do
          let(:auth_user_shopping_datum_records_with_true) { FactoryBot.create_list(:shopping_datum_shopping_date, 5, user: authenticate_user, shop: authenticate_user_test_shop, is_finish: "true") }
          let!(:create_data) do
            auth_user_shopping_datum_records_with_true.each do |datum|
              create_memos_with_word(shopping_datum: datum, number: 2, shop: authenticate_user_test_shop)
            end
          end
          before do
            FactoryBot.rewind_sequences
          end

          context "検索ワード「test_shop」の場合" do
            let(:word) { "test_shop" }
            context "期間がどちらか一方しか入力されていない場合" do
              context "startしか入力されていない場合" do
                let(:start_date) { Date.today }
                let(:end_date) { "" }
                include_context "request_from_API"
                it "ステータスコード400と指定のメッセージを返すこと" do
                  expect(response).to have_http_status(400)
                  expect(@json_response.values[0]).to eq("両方の日付を入力してください")
                end
              end
              context "endしか入力されていない場合" do
                let(:start_date) { "" }
                let(:end_date) { Date.today }
                include_context "request_from_API"
                it "ステータスコード400と指定のメッセージを返すこと" do
                  expect(response).to have_http_status(400)
                  expect(@json_response.values[0]).to eq("両方の日付を入力してください")
                end
              end
              context "指定期間での検索結果が見つからなかった場合" do
                let(:start_date) { "9999-01-01" }
                let(:end_date) { "9999-01-02" }
                include_context "request_from_API"
                it "ステータスコード404と指定の文字列を返すこと" do
                  expect(response).to have_http_status(404)
                  expect(@json_response.values[0]).to eq("お買物履歴が見つかりませんでした")
                end
              end
            end
          end
        end
      end
    end
  end

  private

  def create_memos_with_word(shopping_datum:, number:, shop: authenticate_user_shop)
    FactoryBot.create_list(
      :memo,
      number,
      user: authenticate_user,
      shop: shop,
      shopping_datum: shopping_datum,
      purchase_name: defined?(word) ? "#{ word }#{ Faker::Commerce.product_name }" : Faker::Commerce.product_name
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
