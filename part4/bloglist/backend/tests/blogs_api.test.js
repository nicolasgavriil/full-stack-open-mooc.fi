import { test, describe, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import assert from "node:assert";
import bcrypt from "bcrypt";

import app from "../app.js";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";

const api = supertest(app);

const initialUsers = [
  {
    username: "ada",
    name: "Ada Lovelace",
    password: "salainen",
  },
  {
    username: "turing",
    name: "Alan Turing",
    password: "salainen",
  },
];

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  return blogs.map((b) => b.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const loginAndGetToken = async (username, password) => {
  const response = await api
    .post("/api/login")
    .send({ username, password })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.ok(response.body.token, "Login response should include token");

  return response.body.token;
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("salainen", 10);

  const createdUsers = await User.insertMany(
    initialUsers.map((user) => ({
      username: user.username,
      name: user.name,
      passwordHash,
      blogs: [],
    })),
  );

  const ada = createdUsers[0];

  const createdBlogs = await Blog.insertMany(
    initialBlogs.map((blog) => ({
      ...blog,
      user: ada._id,
    })),
  );

  ada.blogs = createdBlogs.map((b) => b._id);
  await ada.save();
});

describe("when there are some initial blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test("blog by id is returned", async () => {
    const blogs = await blogsInDb();
    const blogToRetrieve = blogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToRetrieve.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(resultBlog.body.id, blogToRetrieve.id);
    assert.strictEqual(resultBlog.body.title, blogToRetrieve.title);
    assert.strictEqual(resultBlog.body.author, blogToRetrieve.author);
    assert.strictEqual(resultBlog.body.url, blogToRetrieve.url);
    assert.strictEqual(resultBlog.body.likes, blogToRetrieve.likes);
  });

  test("blogs have id property", async () => {
    const response = await api.get("/api/blogs").expect(200);

    for (const blog of response.body) {
      assert.ok(Object.hasOwn(blog, "id"), "Property id is missing");
    }
  });

  test("blogs do NOT have _id property", async () => {
    const response = await api.get("/api/blogs").expect(200);

    for (const blog of response.body) {
      assert.ok(!Object.hasOwn(blog, "_id"), "Property _id should not exist");
    }
  });
});

describe("adding a blog", () => {
  test("fails with status 401 if token is missing", async () => {
    const newBlog = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
      likes: 77,
    };

    const blogsAtStart = await blogsInDb();

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test("succeeds with valid token and valid data", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const newBlog = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
      likes: 77,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.title, newBlog.title);
    assert.strictEqual(response.body.author, newBlog.author);
    assert.strictEqual(response.body.url, newBlog.url);
    assert.strictEqual(response.body.likes, newBlog.likes);

    const blogsAtEnd = await blogsInDb();
    const titles = blogsAtEnd.map((b) => b.title);

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);
    assert.ok(titles.includes(newBlog.title));
  });

  test("saved blog is associated with the authenticated user", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const newBlog = {
      title: "Owned blog",
      author: "Ada Lovelace",
      url: "https://example.com/owned-blog",
      likes: 2,
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const createdUser = await User.findOne({ username: "ada" });
    assert.ok(
      createdUser.blogs.map((id) => id.toString()).includes(response.body.id),
    );
  });

  test("likes default to 0 if not provided", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const blogWithoutLikes = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
    };

    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0, "Likes should be 0");
  });

  test("fails if title is missing", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const blogWithoutTitle = {
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
    };

    const blogsAtStart = await blogsInDb();

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test("fails if url is missing", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const blogWithoutUrl = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
    };

    const blogsAtStart = await blogsInDb();

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });
});

describe("updating a blog", () => {
  test("fails with status 401 if token is missing", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 55 })
      .expect(401);
  });

  test("fails with status 403 when non-owner tries to update", async () => {
    const token = await loginAndGetToken("turing", "salainen");

    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ likes: 55 })
      .expect(403)
      .expect("Content-Type", /application\/json/);

    assert.ok(response.body.error);

    const blogsAtEnd = await blogsInDb();
    const unchangedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    assert.strictEqual(unchangedBlog.likes, blogToUpdate.likes);
  });

  test("succeeds when owner provides valid token", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ likes: 55 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 55);

    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);

    assert.ok(updatedBlog, "Updated blog should exist");
    assert.strictEqual(updatedBlog.likes, 55, "Likes should have been updated");
  });
});

describe("deleting a blog", () => {
  test("fails with status 401 if token is missing", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test("fails with status 403 when non-owner tries to delete", async () => {
    const token = await loginAndGetToken("turing", "salainen");

    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    const blogsAtEnd = await blogsInDb();
    const ids = blogsAtEnd.map((b) => b.id);

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    assert.ok(ids.includes(blogToDelete.id));
  });

  test("succeeds when owner provides valid token", async () => {
    const token = await loginAndGetToken("ada", "salainen");

    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await blogsInDb();
    const ids = blogsAtEnd.map((blog) => blog.id);

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    assert.ok(!ids.includes(blogToDelete.id));
  });
});

after(async () => {
  await mongoose.connection.close();
});
