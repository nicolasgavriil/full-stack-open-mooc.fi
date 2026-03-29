import { test, describe, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import { Blog } from "../models/blog.js";
import assert from "node:assert";

const api = supertest(app);

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
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe("when there are some initial blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const blogs = await blogsInDb();
    assert.strictEqual(blogs.length, initialBlogs.length);
  });

  test("blog by id is returned", async () => {
    const blogs = await blogsInDb();
    const blogToRetrieve = blogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToRetrieve.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToRetrieve);
  });

  test("blog has id property", async () => {
    const blogs = await blogsInDb();
    for (const blog of blogs) {
      assert.ok(Object.hasOwn(blog, "id"), "Property id is missing");
    }
  });

  test("blog does NOT have _id property", async () => {
    const blogs = await blogsInDb();
    for (const blog of blogs) {
      assert.ok(!Object.hasOwn(blog, "_id"), "Property _id should not exist");
    }
  });
});

describe("adding a blog", () => {
  test("succeeds with valid data", async () => {
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

    const blogs = await blogsInDb();
    const titles = blogs.map((blog) => blog.title);

    assert.strictEqual(blogs.length, initialBlogs.length + 1);
    assert.ok(titles.includes("Potatos are great"));
  });

  test("fails with missing body (400)", async () => {
    await api.post("/api/blogs").expect(400);
  });

  test("likes default to 0 if not provided", async () => {
    const blogWithoutLikes = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
    };

    const response = await api
      .post("/api/blogs")
      .send(blogWithoutLikes)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 0, "Likes should be 0");
  });

  test("fails if title is missing (400)", async () => {
    const blogWithoutTitle = {
      author: "Alcachofus Maximus",
      url: "potatosftw.com",
    };

    await api.post("/api/blogs").send(blogWithoutTitle).expect(400);
  });

  test("fails if url is missing (400)", async () => {
    const blogWithoutUrl = {
      title: "Potatos are great",
      author: "Alcachofus Maximus",
    };

    await api.post("/api/blogs").send(blogWithoutUrl).expect(400);
  });
});

describe("updating a blog", () => {
  test("succeeds when providing likes", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 55 })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      updatedBlog.body.likes,
      55,
      "Likes should be equal to the updated number",
    );
  });
});

describe("deleting a blog", () => {
  test("succeeds with valid id", async () => {
    const blogsAtStart = await blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await blogsInDb();
    assert.strictEqual(
      blogsAtEnd.length,
      blogsAtStart.length - 1,
      "Number of blogs should be reduced by 1",
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
