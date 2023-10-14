FactoryBot.define do
  factory :user do
    provider { "email" }
    sequence(:email) { |n| "test#{n}@example.com" }
    uid { email }
    password { "password" }
    remember_created_at { nil }
    name { Faker::Name.name }
    nickname { Faker::FunnyName.name }
    tokens { nil }
  end
end
