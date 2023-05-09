class CreateMemos < ActiveRecord::Migration[6.1]
  def change
    create_table :memos do |t|
      t.string :user_id, null: false
      t.string :shopping_data_id, null: false
      t.string :purchase_name, null: false
      t.string :shopping_memo
      t.string :amount
      t.string :price
      t.string :shopping_date
      t.string :memo_type
      t.timestamps
    end
  end
end
