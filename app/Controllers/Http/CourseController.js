"use strict";

const sharedController = require("./SharedController");

class CourseController {
  async add({ request, response }) {
    try {
      const { title, grade, credit_load } = request.all();
      const errors = sharedController.missingRequirements(
        title,
        grade,
        credit_load
      );
      if (errors.length) {
        return response
          .status(400)
          .send(`Invalid request. ${errors.join(" ")} are required`);
      }

      const course = new Course();
      course.title = title
      course.grade = grade
      course.credit_load = credit_load

      return await course.save()
    } catch (error) {
        
    }
  }
}

module.exports = CourseController;
