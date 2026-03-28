import { test, describe, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { Blog } from "../models/blog.js";
import assert from "node:assert";

const api = supertest(app);

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

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
  assert.strictEqual(response.body.length, 6);
});

test("blog has id property", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  for (const blog of response.body) {
    assert.ok(Object.hasOwn(blog, "id"), "Property id is missing");
  }
});

test("blog does NOT have _id property", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  for (const blog of response.body) {
    assert.ok(!Object.hasOwn(blog, "_id"), "Property _id should not exist");
  }
});

test("blog posted successfully", async () => {
  const newBlog = {
    title: "Potatos are great",
    author: "Alcachofus Maximus",
    url: "potatosftw.com",
    likes: 77,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const titles = response.body.map((blog) => blog.title);

  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  assert.ok(titles.includes("Potatos are great"));
});

test("blog post missing body", async () => {
  await api.post("/api/blogs").expect(400);
});

test("likes default to 0", async () => {
  const blogWithoutLikes = {
    title: "Potatos are great",
    author: "Alcachofus Maximus",
    url: "potatosftw.com",
  };

  const response = await api.post("/api/blogs").send(blogWithoutLikes);
  assert.ok(Object.hasOwn(response.body, "likes"), "Property likes is missing");
});

test("title is required", async () => {
  const blogWithoutTitle = {
    author: "Alcachofus Maximus",
    url: "potatosftw.com",
  };

  await api.post("/api/blogs").send(blogWithoutTitle).expect(400);
});

test("url is required", async () => {
  const blogWithoutUrl = {
    title: "Potatos are great",
    author: "Alcachofus Maximus",
  };

  await api.post("/api/blogs").send(blogWithoutUrl).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
