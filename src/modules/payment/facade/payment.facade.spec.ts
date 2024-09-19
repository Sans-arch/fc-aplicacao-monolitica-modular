import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import { PaymentFacadeInputDto } from "./payment.facade.interface";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("Payment Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a transaction", async () => {
    const facade = PaymentFacadeFactory.create();

    const input: PaymentFacadeInputDto = {
      amount: 100,
      orderId: "1",
    };

    const result = await facade.process(input);

    expect(result).toBeDefined();
    expect(result.transactionId).toBeDefined();
    expect(result.orderId).toBe(input.orderId);
    expect(result.amount).toBe(input.amount);
    expect(result.status).toBe("approved");
  });
});
