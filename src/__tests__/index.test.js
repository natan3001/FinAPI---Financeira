const request = require("supertest");
const app = require("../app");

const accountDefault = {
  name: "Test Account Name",
  cpf: "1234567910",
};

const accountDefaultToDelete = {
  name: "Test Account to Delete",
  cpf: "88888888888",
};

describe("POST /account", () => {
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

describe("GET /account", () => {
  test("Should return a account", async () => {
    const response = await request(app)
      .get("/account")
      .set("cpf", accountDefault.cpf);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(accountDefault.name);
  });

  test("When the account not exists", async () => {
    const response = await request(app)
      .get("/account")
      .set("cpf", "00000000000");

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Customer not found!");
  });
});

describe("PUT /account", () => {
  test("Update name in account", async () => {
    const response = await request(app)
      .put("/account")
      .send({
        name: "Updated Test Account Name",
      })
      .set("cpf", accountDefault.cpf)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
  });
});

describe("DELETE /account", () => {
  test("Create a new account to delete", async () => {
    const response = await request(app)
      .post("/account")
      .send(accountDefaultToDelete)
      .set("Content-Type", "application/json");

    expect(response.statusCode).toBe(201);
  });

  test("Delete account", async () => {
    const response = await request(app)
      .delete("/account")
      .set("cpf", accountDefaultToDelete.cpf);

    expect(response.status).toBe(200);
  });

  test("The account must have been deleted", async () => {
    const response = await request(app)
      .get("/account")
      .set("cpf", accountDefaultToDelete.cpf);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Customer not found!");
  });
});

describe("GET /statement", () => {
  test("Should return the statement", async () => {
    const response = await request(app)
      .get("/statement")
      .set("cpf", accountDefault.cpf);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /deposit", () => {
  test("Make a deposit", async () => {
    const response = await request(app)
      .post("/deposit")
      .set("cpf", accountDefault.cpf)
      .send({
        description: "Deposit Test",
        amount: 500,
      });

    expect(response.status).toBe(201);
  });
});

describe("POST /withdraw", () => {
  test("Make a withdraw", async () => {
    const response = await request(app)
      .post("/withdraw")
      .set("cpf", accountDefault.cpf)
      .send({
        amount: 150,
      });

    expect(response.status).toBe(201);
  });
  test("Insufficient balance", async () => {
    const response = await request(app)
      .post("/withdraw")
      .set("cpf", accountDefault.cpf)
      .send({
        amount: 500,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toEqual("Insufficient balance!");
  });
});

describe("GET /statement/date", () => {
  test("Should return the statement filtered by date", async () => {
    const date = new Date();
    const formatedDate = date.toISOString().split("T")[0];

    const response = await request(app)
      .get("/statement/date")
      .set("cpf", accountDefault.cpf)
      .query({
        date: formatedDate,
      });

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body[0].description).toBe("Deposit Test");
  });
});
