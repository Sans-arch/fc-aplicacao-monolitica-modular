import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice_item.model";
import Invoice from "../domain/invoice";
import Address from "../domain/address";
import InvoiceItem from "../domain/invoice_item";
import InvoiceRepository from "./invoice.repository";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "123456789",
      address: new Address({
        city: "São Paulo",
        complement: "Complement",
        number: "123",
        state: "SP",
        street: "Street",
        zipCode: "12345678",
      }),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Product 1",
          price: 10,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Product 2",
          price: 20,
        }),
      ],
    });

    const repository = new InvoiceRepository();
    await repository.save(invoice);

    const result = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemModel] });

    expect(result?.id).toBe(invoice.id.id);
    expect(result?.name).toEqual(invoice.name);
    expect(result?.document).toEqual(invoice.document);
    expect(result?.street).toEqual(invoice.address.street);
  });

  it("should find an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "John Doe",
      document: "123456789",
      address: new Address({
        city: "São Paulo",
        complement: "Complement",
        number: "123",
        state: "SP",
        street: "Street",
        zipCode: "12345678",
      }),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Product 1",
          price: 10,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Product 2",
          price: 20,
        }),
      ],
    });

    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      {
        include: [
          {
            model: InvoiceItemModel,
          },
        ],
      }
    );

    const repository = new InvoiceRepository();
    const result = await repository.find("1");

    expect(result?.id.id).toBe(invoice.id.id);
    expect(result?.name).toEqual(invoice.name);
    expect(result?.document).toEqual(invoice.document);
    expect(result?.address.street).toEqual(invoice.address.street);
  });
});
