import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import { ProcessPaymentInputDto } from "./process-payment.dto";
import ProcessPaymentUsecase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
};

describe("Process Payment Usecase unit tests", () => {
  it("should process a transaction", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUsecase(paymentRepository);

    const input: ProcessPaymentInputDto = {
      orderId: "1",
      amount: 100,
    };
    const result = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.transactionId).toBe(transaction.id.id);
    expect(result.status).toBe("approved");
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(100);
    expect(result.createdAt).toBe(transaction.createdAt);
    expect(result.updatedAt).toBe(transaction.updatedAt);
  });
});
