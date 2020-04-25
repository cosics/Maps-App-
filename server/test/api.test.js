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
    const requestObj = {
      name: "Cezara",
      message: "cea mai aplicatzie",
      latitude: -90,
      longitude: 180,
    };
    const responseObj = {
      ...requestObj,
      _id: "5b57d127923211248855977c",
      date: new Date(),
    };
    request(app)
      .post("/api/v1/messages")
      .send(requestObj)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body._id = "5b57d127923211248855977c";
        res.body.date = new Date();
      })
      .expect(200, responseObj, done);
  });
  it("can sign up with a name that has diacritics", (done) => {
    const requestObj = {
      name: "Yo",
      message: "cea mai aplicatzie",
      latitude: -90,
      longitude: 180,
    };
    const responseObj = {
      ...requestObj,
      _id: "5b57d127923211248855977c",
      date: new Date(),
    };
    request(app)
      .post("/api/v1/messages")
      .send(requestObj)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body._id = "5b57d127923211248855977c";
        res.body.date = new Date();
      })
      .expect(200, responseObj, done);
  });
});
