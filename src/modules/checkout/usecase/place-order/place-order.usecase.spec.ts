import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
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
        find: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error
      placeOrderUsecase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUsecase["getProduct"]("0")).rejects.toThrow(new Error("Product not found"));
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };

      // @ts-expect-error - force set catalogFacade
      placeOrderUsecase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUsecase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          description: "Product 0 description",
          name: "Product 0",
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers({ advanceTimers: true });
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

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

    describe("place an order", () => {
      const clientProps = {
        id: "1c",
        name: "Client 0",
        document: "0000",
        email: "client@user.com",
        street: "some address",
        number: "1",
        complement: "",
        city: "some city",
        state: "some state",
        zipCode: "000",
      };

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
      };

      const mockPaymentFacade = {
        process: jest.fn(),
      };

      const mockCheckoutRepo = {
        addOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        generateInvoice: jest.fn().mockResolvedValue({ id: "1i" }),
      };

      const placeOrderUsecase = new PlaceOrderUsecase(
        mockClientFacade as any,
        null,
        null,
        mockCheckoutRepo as any,
        mockInvoiceFacade as any,
        mockPaymentFacade
      );

      const products = {
        "1": new Product({
          id: new Id("1"),
          name: "Product 1",
          description: "Product 1 description",
          salesPrice: 40,
        }),
        "2": new Product({
          id: new Id("2"),
          name: `Product 2`,
          description: "some description",
          salesPrice: 30,
        }),
      };

      const mockValidateProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, "validateProducts")
        // @ts-expect-error
        .mockResolvedValue(null);

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUsecase, "getProduct")
        // @ts-expect-error
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it("should not be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "error",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUsecase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(0);
      });

      it("should be approved", async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: "1t",
          orderId: "1o",
          amount: 100,
          status: "approved",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: "1c",
          products: [{ productId: "1" }, { productId: "2" }],
        };

        let output = await placeOrderUsecase.execute(input);

        expect(output.invoiceId).toBe("1i");
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [
            {
              id: products["1"].id.id,
              name: products["1"].name,
              price: products["1"].salesPrice,
            },
            {
              id: products["2"].id.id,
              name: products["2"].name,
              price: products["2"].salesPrice,
            },
          ],
        });
      });
    });
  });
});
