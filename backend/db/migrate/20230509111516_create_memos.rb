class CreateMemos < ActiveRecord::Migration[6.1]
  def change
    create_table :memos do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shop, null: false, foreign_key: true
      t.references :shopping_datum, null: false, foreign_key: true
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
