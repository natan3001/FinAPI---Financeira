const request = require("supertest");
const app = require("../app");

const accountDefault = {
  name: "Test Account",
  cpf: "1234567910",
};

describe("POST account", () => {
  test("Create a new account", async () => {
    const response = await request(app)
      .post("/account")
      .send(accountDefault)
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(201);
  });

  test("Account already exists", async () => {
    const response = await request(app)
      .post("/account")
      .send(accountDefault)
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual("Customer already exists!");
  });
});

describe("GET statements", () => {
  test("Should return the statement", async () => {
    const response = await request(app)
      .get("/statement")
      .set("cpf", accountDefault.cpf);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("When the account not exists", async () => {
    const response = await request(app)
      .get("/statement")
      .set("cpf", "00000000000");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Customer not found!");
  });
});
