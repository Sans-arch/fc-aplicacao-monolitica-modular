import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUsecase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
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

    console.log(result);
  });
});
