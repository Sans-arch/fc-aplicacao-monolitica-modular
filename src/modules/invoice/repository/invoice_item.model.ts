import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "invoice_items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}
