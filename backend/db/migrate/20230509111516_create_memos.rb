class CreateMemos < ActiveRecord::Migration[6.1]
  def change
    create_table :memos do |t|
      t.string :user_id, null: false
      t.references :shop, null: false, foreign_key: true
      t.string :shopping_datum_id, null: false
      t.string :purchase_name, null: false
      t.string :shopping_detail_memo
      t.string :amount
      t.string :price
      t.string :shopping_date, null: false
      t.string :memo_type
      t.integer :asc
      t.date :expiry_date_start
      t.date :expiry_date_end
      t.boolean :is_bought, default: ""
      t.timestamps
    end
  end
end
