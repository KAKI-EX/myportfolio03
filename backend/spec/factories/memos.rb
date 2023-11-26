FactoryBot.define do

  sequence :asc do |n|
    n
  end


# 買い物が終わっているダミーデータ
  factory :memo do
    user
    shop { association :shop, user: user }
    shopping_datum { association :shopping_datum, user: user, shop: shop }

    # user_id { Faker::Alphanumeric.alphanumeric(number: 36) } #uuidのため36桁
    # shop_id { Faker::Number.between(from: 1, to: 99).to_s }
    # shopping_datum_id { Faker::Alphanumeric.alphanumeric(number: 36) }
    purchase_name { "#{Faker::Commerce.product_name} #{Faker::Color.color_name}" }
    shopping_detail_memo {Faker::Commerce.department(max: 3) }
    amount { Faker::Number.between(from: 1, to: 99).to_s }
    price { Faker::Number.between(from: 0, to: 10000).to_s }
    shopping_date { shopping_datum.shopping_date }
    memo_type { "" }
    asc { generate :asc }
    expiry_date_start { "" }
    expiry_date_end { Faker::Date.between(from: '2023-01-01', to: '2023-12-31') }
    is_bought { true }
    is_display { true }
    is_expiry_date { true }
  end

# ed = expiry_date
  trait :exsiting_ed_and_finished_shopping do
    is_bought { false }
    is_display { false }
    is_expiry_date { true }
  end

  factory :diff_by_purchase_name, parent: :memo do
    transient do
      custom_purchase_name { nil }
    end
    purchase_name { "#{custom_purchase_name}#{Faker::Commerce.product_name} #{Faker::Color.color_name}" }
  end
end
