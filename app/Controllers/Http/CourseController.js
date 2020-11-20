"use strict";
const Course = use("App/Models/Course");
const sharedController = require("./SharedController");

class CourseController {
  async store({ auth, request, response }) {
    try {
      const { title, grade, credit_load, semester, level } = request.all();
      const errors = sharedController.missingRequirements(
        [title, "title"],
        [grade, "grade"],
        [credit_load, "credit_load"],
        [semester, "semester"],
        [level, "level"]
      );
      if (errors.length) {
        return response
          .status(400)
          .send(`Invalid request. ${errors.join(", ")} are required`);
      }

      const course = new Course();

      course.title = title;
      course.grade = grade;
      course.credit_load = credit_load;

      // course.title = title;
      // course.grade = grade;
      // course.credit_load = credit_load;

      const user = await auth.getUser()

      // await course.semester().save(semester);
      // await course.user().save(user);
      // await course.level().save(level);

      // await user.courses().save(course);
      return response.status(201).send(course);
    } catch (error) {
      console.log(error);
      return response.status(201).send(error);
    }
  }
}

module.exports = CourseController;
