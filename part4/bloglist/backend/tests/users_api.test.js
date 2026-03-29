import { test, describe, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { User } from "../models/user.js";
import assert from "node:assert";
import bcrypt from "bcrypt";

const api = supertest(app);

const passwordHash = await bcrypt.hash("salainen", 10);

const initialUsers = [
  {
    username: "ada",
    name: "Ada Lovelace",
    passwordHash,
  },
  {
    username: "turing",
    name: "Alan Turing",
    passwordHash,
  },
  {
    username: "grace",
    name: "Grace Hopper",
    passwordHash,
  },
  {
    username: "linus",
    name: "Linus Torvalds",
    passwordHash,
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

describe("when there are some initial users saved", async () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const users = await usersInDb();
    assert.strictEqual(users.length, initialUsers.length);
  });

  test("user by id is returned", async () => {
    const users = await usersInDb();
    const userToRetrieve = users[0];

    const resultUser = await api
      .get(`/api/users/${userToRetrieve.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultUser.body, userToRetrieve);
  });

  test("user has id property", async () => {
    const users = await usersInDb();
    for (const user of users) {
      assert.ok(Object.hasOwn(user, "id"), "Property id is missing");
    }
  });

  test("user does NOT have _id property", async () => {
    const users = await usersInDb();
    for (const user of users) {
      assert.ok(!Object.hasOwn(user, "_id"), "Property _id should not exist");
    }
  });
});

describe("creating a user", () => {
  test("succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
