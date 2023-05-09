class CreateShoppingData < ActiveRecord::Migration[6.1]
  def change
    create_table :shopping_data do |t|
      t.string :user_id
      t.string :shopping_date
      t.string :estimated_budget
      t.string :total_budget
      t.timestamps
    end
  end
end
