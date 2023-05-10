class CreateShoppingData < ActiveRecord::Migration[6.1]
  def change
    create_table :shopping_data do |t|
      t.references :user, null: false, foreign_key: true
      t.references :shop, null: false, foreign_key: true
      t.string :shopping_date
      t.string :shopping_memo
      t.string :estimated_budget
      t.string :total_budget
      t.timestamps
    end
  end
end
