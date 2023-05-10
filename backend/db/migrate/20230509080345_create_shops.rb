class CreateShops < ActiveRecord::Migration[6.1]
  def change
    create_table :shops do |t|
      t.references :user, null: false, foreign_key: true
      t.string :shop_name
      t.string :shop_memo
      t.timestamps
    end
    add_index :shops, [:shop_name, :user_id], unique: true
  end
end
