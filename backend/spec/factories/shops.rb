FactoryBot.define do
  factory :shop do
    # association :user

    shop_name { Faker::Commerce.vendor }
    shop_memo { "#{Faker::Ancient.god} #{ Faker::Appliance.brand } #{ Faker::Beer.malts }" }
  end
end
