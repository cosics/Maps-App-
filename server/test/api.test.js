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
      _id: "5ea5aa2c72102a51b0e1c6f6",
      date: "2020-04-26T15:35:08.161Z",
    };
    request(app)
      .post("/api/v1/messages")
      .send(requestObj)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect((res) => {
        res.body._id = "5ea5aa2c72102a51b0e1c6f6";
        res.body.date = "2020-04-26T15:35:08.161Z";
      })
      .expect(200, responseObj, done);
  });
});
