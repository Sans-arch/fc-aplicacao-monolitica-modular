import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice_item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface";

describe("Invoice Facade test", () => {
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

  it("should generate an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input: GenerateInvoiceFacadeInputDto = {
      name: "John Doeaa",
      city: "São Paulo",
      complement: "Complement",
      document: "123456789",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 20,
        },
      ],
      number: "123",
      state: "SP",
      street: "Street",
      zipCode: "12345678",
    };
    const result = await facade.generateInvoice(input);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe("John Doeaa");
    expect(result.document).toBe("123456789");
    expect(result.city).toBe("São Paulo");
    expect(result.complement).toBe("Complement");
    expect(result.total).toBe(30);
    expect(result.number).toBe("123");
    expect(result.state).toBe("SP");
    expect(result.street).toBe("Street");
    expect(result.zipCode).toBe("12345678");
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe("Product 1");
  });
});
