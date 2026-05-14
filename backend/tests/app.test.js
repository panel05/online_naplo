const request = require("supertest");
const app = require("../app");
const sequelize = require("../config/database");

require("../models/User");
require("../models/Note");

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Online napló API tesztek", () => {
  test("Sikeres regisztráció", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "tesztuser",
        password: "Teszt123!",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Sikeres regisztráció.");
    expect(response.body.user.username).toBe("tesztuser");
  });

  test("Sikeres bejelentkezés", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "tesztuser",
        password: "Teszt123!",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");

    token = response.body.token;
  });

  test("Jegyzet létrehozása tokennel", async () => {
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Teszt jegyzet",
        content: "Ez egy teszt jegyzet tartalma.",
        category: "teszt",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Jegyzet létrehozva.");
    expect(response.body.note.title).toBe("Teszt jegyzet");
  });
});