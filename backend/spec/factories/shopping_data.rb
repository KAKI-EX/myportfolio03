FactoryBot.define do
  factory :shopping_datum do
    # association :user
    # association :shop
    shopping_date { Faker::Date.between(from: '2023-01-01', to: '2023-12-31') }
    shopping_memo { "#{ Faker::Commerce.department } #{ Faker::Commerce.price } #{ Faker::Commerce.material } " }
    estimated_budget { Faker::Number.between(from: 0, to: 10000).to_s }
    total_budget { Faker::Number.between(from: 0, to: 10000).to_s }
    is_finish { true } #trueは買い物が済んでいるメモのこと
    is_open { false } #falseはシェア機能を使用していないということ
  end

  factory :shopping_datum_shopping_date, parent: :shopping_datum do
    sequence(:shopping_date) {|n| Date.today + n.days }
  end
end
