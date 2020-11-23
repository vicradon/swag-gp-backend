"use strict";

const { test, trait, before, after } = use("Test/Suite")("Course");
const Course = use("App/Models/Course");
const User = use("App/Models/User");

trait("Test/ApiClient");
trait("Auth/Client");

const file_scoped_email = "user-1@email.com";

before(async () => {
  await User.create({
    email: file_scoped_email,
    password: "password",
  });
});

test("creates a course", async ({ client }) => {
  const course = await Course.create({
    title: "Course 101",
    code: "COU 101",
    grade: "C",
    credit_load: 4,
    semester: "2",
    level: "100",
  });

  const user = await User.findBy("email", file_scoped_email);
  await user.courses().save(course);

  const response = await client
    .get(`/api/v1/courses/${course.id}`)
    .loginVia(user, "jwt")
    .end();
  response.assertStatus(200);

  response.assertJSONSubset({
    title: "Course 101",
    code: "COU 101",
    grade: "C",
    credit_load: 4,
    semester: "2",
    level: "100",
  });
});

test("updates the created course", async ({ client }) => {
  const course = await Course.find(1);
  const user = await User.findBy("email", file_scoped_email);

  const response = await client
    .patch(`/api/v1/courses/${course.id}`)
    .send({
      title: "Some random title",
      code: "SRT 203",
      grade: "A",
      credit_load: 4,
      semester: "2",
      level: "100",
    })
    .loginVia(user, "jwt")
    .end();
  response.assertStatus(200);

  response.assertJSONSubset({
    title: "Some random title",
    code: "SRT 203",
    grade: "A",
    credit_load: 4,
    semester: "2",
    level: "100",
  });
});

test("Deletes the created course", async ({ client }) => {
  const course = await Course.find(1);
  const user = await User.findBy("email", file_scoped_email);

  const response = await client
    .delete(`/api/v1/courses/${course.id}`)
    .loginVia(user, "jwt")
    .end();
  response.assertStatus(200);
  response.assertText("course deleted successfully");
});

test("returns an array of courses", async ({ client }) => {
  const course2 = await Course.create({
    title: "Course 201",
    code: "COU 201",
    grade: "B",
    credit_load: 4,
    semester: "2",
    level: "200",
  });
  const course3 = await Course.create({
    title: "Course 301",
    code: "COU 301",
    grade: "B",
    credit_load: 4,
    semester: "1",
    level: "300",
  });
  const course4 = await Course.create({
    title: "Some 234",
    code: "SOM 234",
    grade: "A",
    credit_load: 3,
    semester: "2",
    level: "200",
  });
  const course5 = await Course.create({
    title: "Blah Blah",
    code: "BLA 103",
    grade: "B",
    credit_load: 1,
    semester: "1",
    level: "100",
  });

  const user = await User.findBy("email", file_scoped_email);
  await user.courses().save(course2);
  await user.courses().save(course3);
  await user.courses().save(course4);
  await user.courses().save(course5);

  const response = await client
    .get(`/api/v1/courses`)
    .loginVia(user, "jwt")
    .end();
  response.assertStatus(200);

  response.assertJSONSubset([
    {
      title: "Course 201",
      code: "COU 201",
      grade: "B",
      credit_load: 4,
      semester: "2",
      level: "200",
    },
    {
      title: "Course 301",
      code: "COU 301",
      grade: "B",
      credit_load: 4,
      semester: "1",
      level: "300",
    },
    {
      title: "Some 234",
      code: "SOM 234",
      grade: "A",
      credit_load: 3,
      semester: "2",
      level: "200",
    },
    {
      title: "Blah Blah",
      code: "BLA 103",
      grade: "B",
      credit_load: 1,
      semester: "1",
      level: "100",
    },
  ]);
});

after(async () => {
  const user = await User.findBy("email", file_scoped_email);
  await user.delete();
});
