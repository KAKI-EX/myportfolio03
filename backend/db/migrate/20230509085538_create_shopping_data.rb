class CreateShoppingData < ActiveRecord::Migration[6.1]
  def change
    create_table :shopping_data do |t|
      t.string :user_id, null: false
      t.references :shop, null: false, foreign_key: true
      t.string :shopping_date, null: false
      t.string :shopping_memo
      t.string :estimated_budget
      t.string :total_budget
      t.boolean :is_finish
      t.timestamps
    end
  end
end
