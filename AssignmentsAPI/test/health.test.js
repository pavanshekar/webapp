const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app.js");

chai.use(chaiHttp);

describe("/GET healthz", () => {
  it("it should GET healthz status", async () => {
    chai
      .request(server)
      .get("/healthz")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
