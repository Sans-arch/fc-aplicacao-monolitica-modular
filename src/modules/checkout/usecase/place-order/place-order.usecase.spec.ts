import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUsecase from "./place-order.usecase";

describe("PlaceOrderUsecase unit test", () => {
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
        find: jest.fn().mockResolvedValue(null),
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

      await expect(placeOrderUsecase).rejects.toThrow(new Error("No products selected"));

      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });
});
