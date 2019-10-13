import express = require("express");
import supertest = require("supertest");
import requireHeaders from "../../src";


describe("integration with ExpressJs", () => {
    test("it integrates as the middleware", async () => {
        const app = express();
        app.use(requireHeaders({Token: "123"}));

        app.get('/', (req, res) => res.send({result: "123"}));

        const request = supertest(app);

        const res = await request.get('/');

        expect(res.status).toEqual(400);
        expect(res.body).toEqual({errors: {Token: "Value undefined incorrect"}});
    });
});
