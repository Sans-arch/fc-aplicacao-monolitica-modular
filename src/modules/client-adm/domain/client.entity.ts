import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type ClientProps = {
  id?: Id;
  name: string;
  email: string;
  address: string;
  document: string;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  complement: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Client extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _email: string;
  private _address: string;
  private _document: string;
  private _street: string;
  private _number: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _complement: string;

  constructor(props: ClientProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._email = props.email;
    this._address = props.address;
    this._document = props.document;
    this._street = props.street;
    this._number = props.number;
    this._city = props.city;
    this._state = props.state;
    this._zipCode = props.zipCode;
    this._complement = props.complement;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get address(): string {
    return this._address;
  }

  get document(): string {
    return this._document;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get city(): string {
    return this._city;
  }

  get state(): string {
    return this._state;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get complement(): string {
    return this._complement;
  }
}
