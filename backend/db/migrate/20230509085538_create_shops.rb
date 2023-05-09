class CreateShops < ActiveRecord::Migration[6.1]
  def change
    create_table :shops do |t|
      t.string :user_id
      t.string :shop_name
      t.string :shop_memo
      t.timestamps
    end
    add_index :shops, [:shop_name, :user_id], unique: true
  end
end
