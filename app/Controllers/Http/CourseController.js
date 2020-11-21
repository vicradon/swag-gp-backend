"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Course = use("App/Models/Course");
const { validateAll } = use("Validator");

/**
 * Resourceful controller for interacting with courses
 */
class CourseController {
  /**
   * Show a list of all courses.
   * GET courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ auth, request, response }) {
    try {
      const { semester, level } = request.all();

      const rules = {
        semester: "in:1,2",
        level: "in:100,200,300,400,500,600,700,800,900",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const user_id = await auth.user.id;

      let courses = [];

      if (level && !semester) {
        courses = await Course.query()
          .where({ user_id: user_id, level: level })
          .fetch();
      } else if (level && semester) {
        courses = await Course.query()
          .where({ user_id: user_id, level: level, semester: semester })
          .fetch();
      } else {
        courses = await Course.query().where("user_id", user_id).fetch();
      }

      if (courses.rows.length === 0) {
        return response.status(404).send([]);
      }

      return response.status(200).send(courses);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  /**
   * Create/save a new course.
   * POST courses
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ auth, request, response }) {
    try {
      const {
        title,
        grade,
        code,
        credit_load,
        semester,
        level,
      } = request.all();

      const rules = {
        title: "required",
        grade: "required|in:A,B,C,D,F",
        code: "required",
        credit_load: "required|integer",
        semester: "required|in:1,2",
        level: "required|in:100,200,300,400,500,600,700,800,900",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const course = new Course();

      course.title = title;
      course.grade = grade;
      course.code = code;
      course.credit_load = credit_load;
      course.semester = semester;
      course.level = level;

      const user = await auth.getUser();
      await user.courses().save(course);

      return response.status(201).send(course);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  /**
   * Display a single course.
   * GET courses/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show({ auth, params, response }) {
    try {
      const course = await Course.find(params.id);

      if (!course) {
        return response.status(404).send("Course not found");
      }

      const courseOwner = await course.user().fetch();
      const requester = await auth.user;
      if (requester.id !== courseOwner.id) {
        return response
          .status(404)
          .send("You cannot view another user's course");
      }
      return response.status(200).send(course);
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  /**
   * Update course details.
   * PUT or PATCH courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const {
        title,
        grade,
        code,
        credit_load,
        semester,
        level,
      } = request.all();

      const rules = {
        title: "required",
        grade: "required|in:A,B,C,D,F",
        code: "required",
        credit_load: "required|integer",
        semester: "required|in:1,2",
        level: "required|in:100,200,300,400,500,600,700,800,900",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const course = await Course.find(params.id);

      if (!course) {
        return response.status(404).send("Course not found");
      }

      course.title = title;
      course.grade = grade;
      course.code = code;
      course.credit_load = credit_load;
      course.semester = semester;
      course.level = level;

      await course.save();
      return response.status(200).send(course);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }

  /**
   * Delete a course with id.
   * DELETE courses/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const course = await Course.find(params.id);
      if (!course) {
        return response.status(404).send("Course not found");
      }
      await course.delete();
      return response.send("course deleted successfully");
    } catch (error) {
      return response.status(500).send("An error occured");
    }
  }
}

module.exports = CourseController;
