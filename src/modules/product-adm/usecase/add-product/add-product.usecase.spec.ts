import { AddProductInputDto } from "./add-product.dto";
import AddProductUsecase from "./add-product.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Product Usecase unit tests", () => {
  it("should add a product", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUsecase(productRepository);

    const input: AddProductInputDto = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.description).toEqual(input.description);
    expect(result.purchasePrice).toEqual(input.purchasePrice);
    expect(result.stock).toEqual(input.stock);
  });
});
