import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

interface InvoiceItemProps {
  id?: Id;
  name: string;
  price: number;
}

export default class InvoiceItem extends BaseEntity {
  private _name: string;
  private _price: number;

  constructor(props: InvoiceItemProps) {
    super(props.id);
    this._name = props.name;
    this._price = props.price;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }
}
