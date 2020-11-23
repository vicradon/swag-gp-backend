"use strict";

const { test, trait, before, after } = use("Test/Suite")("Cumulative");
const Course = use("App/Models/Course");
const User = use("App/Models/User");
const Preference = use("App/Models/Preference");
const GradeSystem = use("App/Models/GradeSystem");
const Cumulative = use("App/Models/Cumulative");

trait("Test/ApiClient");
trait("Auth/Client");

const file_scoped_email = "user-2@email.com";

before(async () => {
  const grade_system = 5;
  const user = await User.create({
    email: file_scoped_email,
    password: "password",
  });

  const cumulative = await Cumulative.create({
    credit_load: 0,
    grade_point: 0,
    grade_point_average: 0,
  });
  const preference = new Preference();
  const gradeSystemInstance = await GradeSystem.findBy("point", grade_system);

  await preference.gradeSystem().associate(gradeSystemInstance);
  await user.preference().save(preference);
  await user.cumulative().save(cumulative);

  const course1 = await Course.create({
    title: "Course 101",
    code: "COU 101",
    grade: "C",
    credit_load: 4,
    semester: "2",
    level: "100",
  });
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

  await user.courses().save(course1);
  await user.courses().save(course2);
  await user.courses().save(course3);
  await user.courses().save(course4);
  await user.courses().save(course5);
});

test("computes cumulative properly for 5 point system", async ({ client }) => {
  const user = await User.findBy("email", file_scoped_email);

  const response = await client
    .patch(`/api/v1/cumulative`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    credit_load: 16,
    grade_point: 63,
    grade_point_average: 3.94,
  });
});

test("returns cumulative", async ({ client }) => {
  const user = await User.findBy("email", file_scoped_email);

  const response = await client
    .get(`/api/v1/cumulative`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    credit_load: 16,
    grade_point: 63,
    grade_point_average: 3.94,
  });
});

test("computes cumulative properly for 4 point system", async ({ client }) => {
  const user = await User.findBy("email", file_scoped_email);
  const preference = await Preference.findBy('user_id', user.id)

  const gradeSystemInstance = await GradeSystem.findBy("point", 4);
  await preference.gradeSystem().associate(gradeSystemInstance);
  await user.preference().save(preference);
  
  const response = await client
    .patch(`/api/v1/cumulative`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    credit_load: 16,
    grade_point: 47,
    grade_point_average: 2.94,
  });
});

after(async () => {
  const user = await User.findBy("email", file_scoped_email);
  await user.delete();
});
