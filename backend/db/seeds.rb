# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user1 = User.create(
  name: "testUser1",
  email: "test1@gmail.com",
  password: "password"
)

user1shop1 = Shop.create(
  user_id: user1.id,
  shop_name: "test1_user_Shop1",
  shop_memo: "test1_user_Shop1メモ"
)

user1shop2 = Shop.create(
  user_id: user1.id,
  shop_name: "test1_user_Shop2",
  shop_memo: "test1_user_shop2Shopメモ2"
)

user1shop1data1 = ShoppingDatum.create(
  shop_id: user1shop1.id,
  user_id: user1.id,
  shopping_date: "2023-09-01",
  shopping_memo: "testUser_id1",
  estimated_budget: "2000",
  total_budget: "1900"
)

user1shop2data2 = ShoppingDatum.create(
  shop_id: user1shop2.id,
  user_id: user1.id,
  shopping_date: "2023-09-02",
  shopping_memo: "testUser_id1",
  estimated_budget: "2100",
  total_budget: "2000"
)

Memo.create(
  shopping_datum_id: user1shop1data1.id,
  user_id: user1.id,
  shop_id: user1shop1.id,
  purchase_name: "test1ユーザー、shop1、メモ1",
  shopping_detail_memo: "test1ユーザー、shop1、メモ1",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user1shop1data1.id,
  user_id: user1.id,
  shop_id: user1shop1.id,
  purchase_name: "test1ユーザー、shop1、メモ2",
  shopping_detail_memo: "test1ユーザー、shop1、メモ2",
  amount: "1",
  price: "900",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user1shop2data2.id,
  user_id: user1.id,
  shop_id: user1shop2.id,
  purchase_name: "test1ユーザー、shop2、メモ1",
  shopping_detail_memo: "test1ユーザー、shop2、メモ1",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user1shop2data2.id,
  user_id: user1.id,
  shop_id: user1shop2.id,
  purchase_name: "test1ユーザー、shop2、メモ2",
  shopping_detail_memo: "test1ユーザー、shop2、メモ2",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)
# -------------------------------------------

user2 = User.create(
  name: "testUser2",
  email: "test2@gmail.com",
  password: "password"
)

user2shop1 = Shop.create(
  user_id: user2.id,
  shop_name: "test2_user_Shop1",
  shop_memo: "test2_user_Shop1メモ1"
)

user2shop2 = Shop.create(
  user_id: user2.id,
  shop_name: "test2_user_Shop2",
  shop_memo: "test2_user_Shop2メモ2"
)

user2shop1data1 = ShoppingDatum.create(
  shop_id: user2shop1.id,
  user_id: user2.id,
  shopping_date: "2023-10-01",
  shopping_memo: "testUser_id2",
  estimated_budget: "2000",
  total_budget: "1900"
)

user2shop2data2 = ShoppingDatum.create(
  shop_id: user2shop2.id,
  user_id: user2.id,
  shopping_date: "2023-10-02",
  shopping_memo: "testUser_id2",
  estimated_budget: "2100",
  total_budget: "2000"
)

Memo.create(
  shopping_datum_id: user2shop1data1.id,
  shop_id: user2shop1.id,
  user_id: user2.id,
  purchase_name: "test2ユーザー、shop1、メモ1",
  shopping_detail_memo: "test2ユーザー、shop1、メモ1",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user2shop1data1.id,
  shop_id: user2shop1.id,
  user_id: user2.id,
  purchase_name: "test2ユーザー、shop1、メモ2",
  shopping_detail_memo: "test2ユーザー、shop1、メモ2",
  amount: "1",
  price: "900",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user2shop2data2.id,
  shop_id: user2shop2.id,
  user_id: user2.id,
  purchase_name: "test2ユーザー、shop2、メモ1",
  shopping_detail_memo: "test2ユーザー、shop2、メモ1",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)

Memo.create(
  shopping_datum_id: user2shop2data2.id,
  shop_id: user2shop2.id,
  user_id: user2.id,
  purchase_name: "test2ユーザー、shop2、メモ2",
  shopping_detail_memo: "test2ユーザー、shop2、メモ2",
  amount: "1",
  price: "1000",
  shopping_date: "2023-06-17",
  memo_type: "",
)
