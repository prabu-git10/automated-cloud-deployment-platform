const request = require("supertest");
const app = require("./server");

describe("CloudOps API", () => {
  test("GET / should return HTTP 200", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
  });

  test("GET /health should return healthy status", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /version should return HTTP 200", async () => {
    const response = await request(app).get("/version");

    expect(response.statusCode).toBe(200);
    expect(response.body.version).toBeDefined();
  });
});