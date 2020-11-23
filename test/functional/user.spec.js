"use strict";

const { test, trait } = use("Test/Suite")("User");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("Auth/Client");

test("registers a new user", async ({ client }) => {
  const response = await client
    .post(`/api/v1/register`)
    .send({
      email: "test-user@email.com",
      password: "some password",
      grade_system: "5",
    })
    .end();

  response.assertStatus(201);
});

test("logins in a user", async ({ client }) => {
  await User.create({
    email: "some-email@email.com",
    password: "some password",
  });
  const response = await client
    .post(`/api/v1/login`)
    .send({
      email: "some-email@email.com",
      password: "some password",
    })
    .end();

  response.assertStatus(200);
});

test("returns a user's profile", async ({ client }) => {
  const email = "user99@email.com";
  const password = "some password";
  const user = await User.create({ email, password });
  const response = await client
    .get(`/api/v1/users/profile`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);

  response.assertJSONSubset({
    email,
    firstName: null,
    lastName: null,
  });
});

test("updates a user's profile", async ({ client }) => {
  const user = await User.create({
    email: "some-other-email@email.com",
    password: "some password",
  });
  const response = await client
    .patch(`/api/v1/users/profile`)
    .loginVia(user, "jwt")
    .send({
      firstName: "John",
      lastName: "Doe",
    })
    .end();

  response.assertStatus(200);

  response.assertJSONSubset({
    firstName: "John",
    lastName: "Doe",
  });
});

test("updates a user's email", async ({ client }) => {
  const user = await User.create({
    email: "email100@email.com",
    password: "some password",
  });
  const response = await client
    .patch(`/api/v1/users/email`)
    .loginVia(user, "jwt")
    .send({
      email: "the-changed-email@email.com",
    })
    .end();

  response.assertJSONSubset({
    email: "the-changed-email@email.com",
  });

  response.assertStatus(200);
});

test("updates a user's password", async ({ client }) => {
  const user = await User.create({
    email: "email101@email.com",
    password: "some password",
  });
  const response = await client
    .patch(`/api/v1/users/password`)
    .loginVia(user, "jwt")
    .send({
      currentPassword: "some password",
      newPassword: "new password",
    })
    .end();

  response.assertStatus(200);
});
