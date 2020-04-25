const request = require("supertest");

const app = require("../src/app");

describe("GET /api/v1", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "API - 👋🌎🌍🌏",
        },
        done
      );
  });
});

describe("POST /api/v1/messages", () => {
  it("responds with inserted msg", (done) => {
    const result = {
      name: "Cezara",
      message: "cea mai aplicatzie",
      latitude: -90,
      longitude: 180,
    };
    request(app)
      .post("/api/v1/messages")
      .send(result)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, result, done)
      .then((response) => {
        console.log(response);
        done();
      });
  });
});
