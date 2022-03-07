import supertest from "supertest";
import {
  Loginable,
  PasswordUpdatable,
  Registrable,
  Updatable,
} from "../interfaces/Authenticatable";
import { app } from "../app";
import { connection } from "../db/connection";

let jwt: any;

describe("User Registration", () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.clear();
    await connection.close();
  });

  // beforeEach(async () => {
  //   await connection.clear();
  // });

  describe("Create user with valid parameters", () => {
    it("Should return 200 and return user data without password", async () => {
      const payload: Registrable = {
        firstName: "Test",
        lastName: "User",
        email: "testuser@email.com",
        password: "abcd1234$",
        passwordConfirmation: "abcd1234$",
      };
      const response = await supertest(app)
        .post("/api/register")
        .send(payload)
        .set("Accept", "application/json");

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        first_name: "Test",
        last_name: "User",
        email: "testuser@email.com",
        id: 1,
      });
      expect(response.body.password).toBe(undefined);
    });
  });

  describe("Create user with invalid parameters", () => {
    describe("With empty first name", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "",
          lastName: "User",
          email: "testuser@email.com",
          password: "abcd1234$",
          passwordConfirmation: "abcd1234$",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"firstName" is not allowed to be empty'
        );
      });
    });

    describe("With empty last name", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "Test",
          lastName: "",
          email: "testuser@email.com",
          password: "abcd1234$",
          passwordConfirmation: "abcd1234$",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"lastName" is not allowed to be empty'
        );
      });
    });

    describe("With empty email", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "Test",
          lastName: "User",
          email: "",
          password: "abcd1234$",
          passwordConfirmation: "abcd1234$",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"email" is not allowed to be empty'
        );
      });
    });

    describe("With empty password", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "Test",
          lastName: "User",
          email: "testuser@email.com",
          password: "",
          passwordConfirmation: "abcd1234$",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"password" is not allowed to be empty'
        );
      });
    });

    describe("With empty confirm password", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "Test",
          lastName: "User",
          email: "testuser@email.com",
          password: "abcd1234$",
          passwordConfirmation: "",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"passwordConfirmation" is not allowed to be empty'
        );
      });
    });

    describe("With unmatched password and confirm password", () => {
      it("Should return 400 with message", async () => {
        const payload: Registrable = {
          firstName: "Test",
          lastName: "User",
          email: "testuser@email.com",
          password: "abcd1234$",
          passwordConfirmation: "abc",
        };

        const response = await supertest(app)
          .post("/api/register")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual(
          "Password and Password confirmation did not match."
        );
      });
    });
  });

  describe("Login user with incorrect credentials", () => {
    describe("Use incorrect email and password", () => {
      it("Should return 404 with message", async () => {
        const payload: Loginable = {
          email: "testuser1@email.com",
          password: "abcde1234$",
        };
        const response = await supertest(app)
          .post("/api/login")
          .send(payload)
          .set("Accept", "application/json");

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual("Invalid credentials.");
      });
    });

    describe("Using empty email address", () => {
      it("Should return 404 with message", async () => {
        const payload: Loginable = {
          email: "",
          password: "abcde1234$",
        };
        const response = await supertest(app)
          .post("/api/login")
          .send(payload)
          .set("Accept", "application/json");

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"email" is not allowed to be empty'
        );
      });
    });

    describe("Using empty password", () => {
      it("Should return 404 with message", async () => {
        const payload: Loginable = {
          email: "testuser1@email.com",
          password: "",
        };
        const response = await supertest(app)
          .post("/api/login")
          .send(payload)
          .set("Accept", "application/json");

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"password" is not allowed to be empty'
        );
      });
    });
  });

  describe("Login user with correct credentials", () => {
    it("Should return 200 with message and jwt http only cookie", async () => {
      const payload: Loginable = {
        email: "testuser@email.com",
        password: "abcd1234$",
      };
      const response = await supertest(app)
        .post("/api/login")
        .send(payload)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("success");
      expect(response.header["set-cookie"]).not.toBe(null);
      jwt = response.header["set-cookie"][0];
    });
  });

  describe("Get logged in user", () => {
    it("Should return 200 with user data without user password", async () => {
      const response = await supertest(app)
        .get("/api/user")
        .send()
        .set("Accept", "application/json")
        .set("Cookie", jwt);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        first_name: "Test",
        last_name: "User",
        email: "testuser@email.com",
        id: 1,
      });
      expect(response.body.password).toBe(undefined);
    });
  });

  describe("Update user info", () => {
    it("Should return 200 with updated user data without user password", async () => {
      const payload: Updatable = {
        firstName: "Elon",
        lastName: "Musk",
        email: "elon.musk@spacex.com",
      };
      const response = await supertest(app)
        .put("/api/user")
        .send(payload)
        .set("Accept", "application/json")
        .set("Cookie", jwt);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        first_name: "Elon",
        last_name: "Musk",
        email: "elon.musk@spacex.com",
        id: 1,
      });
      expect(response.body.password).toBe(undefined);
    });
  });

  describe("Update user info with empty values", () => {
    describe("Using empty first name", () => {
      it("Should return 400 with message", async () => {
        const payload: Updatable = {
          firstName: "",
          lastName: "Musk",
          email: "elon.musk@spacex.com",
        };
        const response = await supertest(app)
          .put("/api/user")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"firstName" is not allowed to be empty'
        );
      });
    });

    describe("Using empty last name", () => {
      it("Should return 400 with message", async () => {
        const payload: Updatable = {
          firstName: "Elon",
          lastName: "",
          email: "elon.musk@spacex.com",
        };
        const response = await supertest(app)
          .put("/api/user")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"lastName" is not allowed to be empty'
        );
      });
    });

    describe("Using empty email", () => {
      it("Should return 400 with message", async () => {
        const payload: Updatable = {
          firstName: "Elon",
          lastName: "Musk",
          email: "",
        };
        const response = await supertest(app)
          .put("/api/user")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"email" is not allowed to be empty'
        );
      });
    });
  });

  describe("Change user password", () => {
    it("Should return 200 with message", async () => {
      const payload: PasswordUpdatable = {
        currentPassword: "abcd1234$",
        newPassword: "123abc",
        passwordConfirmation: "123abc",
      };
      const response = await supertest(app)
        .put("/api/password")
        .send(payload)
        .set("Accept", "application/json")
        .set("Cookie", jwt);

      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual("success");
    });
  });

  describe("Change user password with incorrect values", () => {
    describe("Using empty current password", () => {
      it("Should return 400 with message", async () => {
        const payload: PasswordUpdatable = {
          currentPassword: "",
          newPassword: "123abc",
          passwordConfirmation: "123abc",
        };
        const response = await supertest(app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"currentPassword" is not allowed to be empty'
        );
      });
    });

    describe("Using empty new password", () => {
      it("Should return 400 with message", async () => {
        const payload: PasswordUpdatable = {
          currentPassword: "abcd1234$",
          newPassword: "",
          passwordConfirmation: "123abc",
        };
        const response = await supertest(app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"newPassword" is not allowed to be empty'
        );
      });
    });

    describe("Using empty confirm  password", () => {
      it("Should return 400 with message", async () => {
        const payload: PasswordUpdatable = {
          currentPassword: "abcd1234$",
          newPassword: "123abc",
          passwordConfirmation: "",
        };
        const response = await supertest(app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body[0].message).toEqual(
          '"passwordConfirmation" is not allowed to be empty'
        );
      });
    });

    describe("Using incorrect current password", () => {
      it("Should return 400 with message", async () => {
        const payload: PasswordUpdatable = {
          currentPassword: "abcd1234s$",
          newPassword: "123abc",
          passwordConfirmation: "123abc",
        };
        const response = await supertest(app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual(
          "Your current password is incorrect. Please try again later."
        );
      });
    });

    describe("Using unmatched new password and confirm password", () => {
      it("Should return 400 with message", async () => {
        const payload: PasswordUpdatable = {
          currentPassword: "123abc",
          newPassword: "123abcd",
          passwordConfirmation: "123asbc",
        };
        const response = await supertest(app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual(
          "Your new passwords did not match with password confirmation."
        );
      });
    });
  });

  describe("Logout user", () => {
    it("Should return 200 with message", async () => {
      const response = await supertest(app)
        .post("/api/logout")
        .send()
        .set("Accept", "application/json")
        .set("Cookie", jwt);

      expect(response.status).toEqual(200);
      const jwtString = response.header["set-cookie"][0].split(";");
      const value = jwtString[0].split("=");
      expect(value[1]).toBe("");
      expect(response.body.message).toEqual("success");
    });
  });
});
