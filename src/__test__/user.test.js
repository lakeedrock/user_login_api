"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const connection_1 = require("../db/connection");
let jwt;
describe("User Registration", () => {
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield connection_1.connection.create();
    })
  );
  afterAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield connection_1.connection.clear();
      yield connection_1.connection.close();
    })
  );
  // beforeEach(async () => {
  //   await connection.clear();
  // });
  describe("Create user with valid parameters", () => {
    it("Should return 200 and return user data without password", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
          firstName: "Test",
          lastName: "User",
          email: "testuser@email.com",
          password: "abcd1234$",
          passwordConfirmation: "abcd1234$",
        };
        const response = yield (0, supertest_1.default)(app_1.app)
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
      }));
  });
  describe("Create user with invalid parameters", () => {
    describe("With empty first name", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "",
            lastName: "User",
            email: "testuser@email.com",
            password: "abcd1234$",
            passwordConfirmation: "abcd1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"firstName" is not allowed to be empty'
          );
        }));
    });
    describe("With empty last name", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Test",
            lastName: "",
            email: "testuser@email.com",
            password: "abcd1234$",
            passwordConfirmation: "abcd1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"lastName" is not allowed to be empty'
          );
        }));
    });
    describe("With empty email", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Test",
            lastName: "User",
            email: "",
            password: "abcd1234$",
            passwordConfirmation: "abcd1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"email" is not allowed to be empty'
          );
        }));
    });
    describe("With empty password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Test",
            lastName: "User",
            email: "testuser@email.com",
            password: "",
            passwordConfirmation: "abcd1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"password" is not allowed to be empty'
          );
        }));
    });
    describe("With empty confirm password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Test",
            lastName: "User",
            email: "testuser@email.com",
            password: "abcd1234$",
            passwordConfirmation: "",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"passwordConfirmation" is not allowed to be empty'
          );
        }));
    });
    describe("With unmatched password and confirm password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Test",
            lastName: "User",
            email: "testuser@email.com",
            password: "abcd1234$",
            passwordConfirmation: "abc",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/register")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body.message).toEqual(
            "Password and Password confirmation did not match."
          );
        }));
    });
  });
  describe("Login user with incorrect credentials", () => {
    describe("Use incorrect email and password", () => {
      it("Should return 404 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            email: "testuser1@email.com",
            password: "abcde1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/login")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(404);
          expect(response.body.message).toEqual("Invalid credentials.");
        }));
    });
    describe("Using empty email address", () => {
      it("Should return 404 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            email: "",
            password: "abcde1234$",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/login")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"email" is not allowed to be empty'
          );
        }));
    });
    describe("Using empty password", () => {
      it("Should return 404 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            email: "testuser1@email.com",
            password: "",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/login")
            .send(payload)
            .set("Accept", "application/json");
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"password" is not allowed to be empty'
          );
        }));
    });
  });
  describe("Login user with correct credentials", () => {
    it("Should return 200 with message and jwt http only cookie", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
          email: "testuser@email.com",
          password: "abcd1234$",
        };
        const response = yield (0, supertest_1.default)(app_1.app)
          .post("/api/login")
          .send(payload)
          .set("Accept", "application/json");
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual("success");
        expect(response.header["set-cookie"]).not.toBe(null);
        jwt = response.header["set-cookie"][0];
      }));
  });
  describe("Get logged in user", () => {
    it("Should return 200 with user data without user password", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
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
      }));
  });
  describe("Update user info", () => {
    it("Should return 200 with updated user data without user password", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
          firstName: "Elon",
          lastName: "Musk",
          email: "elon.musk@spacex.com",
        };
        const response = yield (0, supertest_1.default)(app_1.app)
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
      }));
  });
  describe("Update user info with empty values", () => {
    describe("Using empty first name", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "",
            lastName: "Musk",
            email: "elon.musk@spacex.com",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/user")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"firstName" is not allowed to be empty'
          );
        }));
    });
    describe("Using empty last name", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Elon",
            lastName: "",
            email: "elon.musk@spacex.com",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/user")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"lastName" is not allowed to be empty'
          );
        }));
    });
    describe("Using empty email", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            firstName: "Elon",
            lastName: "Musk",
            email: "",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/user")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"email" is not allowed to be empty'
          );
        }));
    });
  });
  describe("Change user password", () => {
    it("Should return 200 with message", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
          currentPassword: "abcd1234$",
          newPassword: "123abc",
          passwordConfirmation: "123abc",
        };
        const response = yield (0, supertest_1.default)(app_1.app)
          .put("/api/password")
          .send(payload)
          .set("Accept", "application/json")
          .set("Cookie", jwt);
        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual("success");
      }));
  });
  describe("Change user password with incorrect values", () => {
    describe("Using empty current password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            currentPassword: "",
            newPassword: "123abc",
            passwordConfirmation: "123abc",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/password")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"currentPassword" is not allowed to be empty'
          );
        }));
    });
    describe("Using empty new password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            currentPassword: "abcd1234$",
            newPassword: "",
            passwordConfirmation: "123abc",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/password")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"newPassword" is not allowed to be empty'
          );
        }));
    });
    describe("Using empty confirm  password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            currentPassword: "abcd1234$",
            newPassword: "123abc",
            passwordConfirmation: "",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/password")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body[0].message).toEqual(
            '"passwordConfirmation" is not allowed to be empty'
          );
        }));
    });
    describe("Using incorrect current password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            currentPassword: "abcd1234s$",
            newPassword: "123abc",
            passwordConfirmation: "123abc",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/password")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body.message).toEqual(
            "Your current password is incorrect. Please try again later."
          );
        }));
    });
    describe("Using unmatched new password and confirm password", () => {
      it("Should return 400 with message", () =>
        __awaiter(void 0, void 0, void 0, function* () {
          const payload = {
            currentPassword: "123abc",
            newPassword: "123abcd",
            passwordConfirmation: "123asbc",
          };
          const response = yield (0, supertest_1.default)(app_1.app)
            .put("/api/password")
            .send(payload)
            .set("Accept", "application/json")
            .set("Cookie", jwt);
          expect(response.status).toEqual(400);
          expect(response.body.message).toEqual(
            "Your new passwords did not match with password confirmation."
          );
        }));
    });
  });
  describe("Logout user", () => {
    it("Should return 200 with message", () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
          .post("/api/logout")
          .send()
          .set("Accept", "application/json")
          .set("Cookie", jwt);
        expect(response.status).toEqual(200);
        const jwtString = response.header["set-cookie"][0].split(";");
        const value = jwtString[0].split("=");
        expect(value[1]).toBe("");
        expect(response.body.message).toEqual("success");
      }));
  });
});
