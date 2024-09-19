import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice_item";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

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
      price: 70,
    }),
  ],
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn(),
  };
};

describe("Generate Invoice Usecase unit tests", () => {
  it("should generate an invoice", async () => {
    const productRepository = MockRepository();
    const usecase = new GenerateInvoiceUsecase(productRepository);

    const input: GenerateInvoiceUseCaseInputDto = {
      name: "John Doe",
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

    const result = await usecase.execute(input);

    expect(result.id).toBe("1");
    expect(result.name).toBe("John Doe");
    expect(result.document).toBe("123456789");
    expect(result.city).toBe("São Paulo");
    expect(result.complement).toBe("Complement");
    expect(result.total).toBe(80);
    expect(result.number).toBe("123");
    expect(result.state).toBe("SP");
    expect(result.street).toBe("Street");
    expect(result.zipCode).toBe("12345678");
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Product 1");
  });
});
