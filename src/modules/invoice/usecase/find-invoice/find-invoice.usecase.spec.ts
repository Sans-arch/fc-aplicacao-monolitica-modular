import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice_item";
import { FindInvoiceUseCaseInputDTO } from "./find-invoice.interface";
import FindInvoiceUsecase from "./find-invoice.usecase";

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
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit tests", () => {
  it("should generate an invoice", async () => {
    const productRepository = MockRepository();
    const usecase = new FindInvoiceUsecase(productRepository);

    const input: FindInvoiceUseCaseInputDTO = { id: "1" };
    const result = await usecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(result?.id).toEqual(invoice.id.id);
    expect(result?.name).toEqual(invoice.name);
    expect(result?.document).toEqual(invoice.document);
    expect(result?.address.street).toEqual(invoice.address.street);
    expect(result?.address.number).toEqual(invoice.address.number);
    expect(result?.address.complement).toEqual(invoice.address.complement);
    expect(result?.address.city).toEqual(invoice.address.city);
    expect(result?.address.state).toEqual(invoice.address.state);
    expect(result?.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result?.total).toEqual(invoice.total);
    expect(result?.items).toHaveLength(2);
    expect(result?.items[0].id).toEqual(invoice.items[0].id.id);
    expect(result?.items[0].name).toEqual(invoice.items[0].name);
    expect(result?.items[0].price).toEqual(invoice.items[0].price);
    expect(result?.items[1].id).toEqual(invoice.items[1].id.id);
    expect(result?.items[1].name).toEqual(invoice.items[1].name);
    expect(result?.items[1].price).toEqual(invoice.items[1].price);
  });
});
