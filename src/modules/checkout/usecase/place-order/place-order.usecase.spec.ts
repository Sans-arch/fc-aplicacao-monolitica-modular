import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUsecase unit test", () => {
  describe("validateProducts method", () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUsecase = new PlaceOrderUsecase();

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUsecase["validateProducts"](input)).rejects.toThrow(new Error("No products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => {
          return Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          });
        }),
      };

      // @ts-expect-error - force set productFacade
      placeOrderUsecase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(placeOrderUsecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(placeOrderUsecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "1" }, { productId: "2" }],
      };
      await expect(placeOrderUsecase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(4);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers({ advanceTimers: true });
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // @ts-expect-error - no params in constructor
    const placeOrderUsecase = new PlaceOrderUsecase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn(),
      };
    });
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };
      // @ts-expect-error
      const placeOrderUsecase = new PlaceOrderUsecase();
      // @ts-expect-error
      placeOrderUsecase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrow(new Error("Client not found"));
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      // @ts-expect-error
      const placeOrderUsecase = new PlaceOrderUsecase();

      const mockValidateProducts = jest
        .spyOn(placeOrderUsecase, "execute")
        .mockRejectedValue(new Error("No products selected"));

      // @ts-expect-error - force set clientFacade
      placeOrderUsecase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUsecase.execute(input)).rejects.toThrow(new Error("No products selected"));

      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });
});
