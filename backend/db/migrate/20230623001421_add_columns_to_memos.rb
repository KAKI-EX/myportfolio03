class AddColumnsToMemos < ActiveRecord::Migration[6.1]
  def change
    add_column :memos, :is_display, :boolean, default: true
    add_column :memos, :is_expiry_date, :boolean, default: false
  end
end
