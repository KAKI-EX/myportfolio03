# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(
  id: "1",
  name: "testUser1",
  email: "test1@gmail.com",
  password: "password"
)

Shop.create(
  id: "1",
  user_id: "1",
  shop_name: "test1_user_Shop1",
  shop_memo: "test1_user_Shop1メモ"
)

Shop.create(
  id: "2",
  user_id: "1",
  shop_name: "test1_user_Shop2",
  shop_memo: "test1_user_shop2Shopメモ2"
)

ShoppingDatum.create(
  id: "1",
  shop_id: "1",
  user_id: "1",
  shopping_date: "20230901",
  estimated_budget: "2000",
  total_budget: "1900"
)

ShoppingDatum.create(
  id: "2",
  shop_id: "2",
  user_id: "1",
  shopping_date: "20230902",
  estimated_budget: "2100",
  total_budget: "2000"
)

Memo.create(
  id: "1",
  shopping_data_id: "1",
  user_id: "1",
  shop_id: "1",
  purchase_name: "test1_user_purchase1",
  shopping_memo: "test1_user_purChase1メモ1",
  amount: "1",
  price: "1000",
  memo_type: "",
)

Memo.create(
  id: "2",
  shopping_data_id: "1",
  user_id: "1",
  shop_id: "1",
  purchase_name: "test1_user_purchase2",
  shopping_memo: "test1_user_purchase2_メモ2",
  amount: "1",
  price: "900",
  memo_type: "",
)

Memo.create(
  id: "5",
  shopping_data_id: "2",
  user_id: "1",
  shop_id: "2",
  purchase_name: "test1_user_purchase1",
  shopping_memo: "test1_user_purChase1メモ1",
  amount: "1",
  price: "1000",
  memo_type: "",
)

Memo.create(
  id: "6",
  shopping_data_id: "2",
  user_id: "1",
  shop_id: "2",
  purchase_name: "test1_user_purchase2",
  shopping_memo: "test1_user_purchase2_メモ2",
  amount: "1",
  price: "1000",
  memo_type: "",
)
# -------------------------------------------

User.create(
  id: "2",
  name: "testUser2",
  email: "test2@gmail.com",
  password: "password"
)

Shop.create(
  id: "3",
  user_id: "2",
  shop_name: "test2_user_Shop1",
  shop_memo: "test2_user_Shop1メモ1"
)

Shop.create(
  id: "4",
  user_id: "2",
  shop_name: "test2_user_Shop2",
  shop_memo: "test2_user_Shop2メモ2"
)

ShoppingDatum.create(
  id: "3",
  shop_id: "3",
  user_id: "2",
  shopping_date: "20231001",
  estimated_budget: "2000",
  total_budget: "1900"
)

ShoppingDatum.create(
  id: "4",
  shop_id: "4",
  user_id: "2",
  shopping_date: "20231002",
  estimated_budget: "2100",
  total_budget: "2000"
)

Memo.create(
  id: "3",
  shopping_data_id: "3",
  shop_id: "3",
  user_id: "2",
  purchase_name: "test2_user_purchase1",
  shopping_memo: "test2_user_purchase1メモ1",
  amount: "1",
  price: "1000",
  memo_type: "",
)

Memo.create(
  id: "4",
  shopping_data_id: "3",
  shop_id: "3",
  user_id: "2",
  purchase_name: "test2_user_purchase1",
  shopping_memo: "test2_user_purchase1メモ2",
  amount: "1",
  price: "900",
  memo_type: "",
)

Memo.create(
  id: "7",
  shopping_data_id: "4",
  shop_id: "4",
  user_id: "2",
  purchase_name: "test2_user_purchase2",
  shopping_memo: "test2_user_purchase2メモ1",
  amount: "1",
  price: "1000",
  memo_type: "",
)

Memo.create(
  id: "8",
  shopping_data_id: "4",
  shop_id: "4",
  user_id: "2",
  purchase_name: "test2_user_purchase2",
  shopping_memo: "test2_user_purchase2メモ2",
  amount: "1",
  price: "1000",
  memo_type: "",
)
