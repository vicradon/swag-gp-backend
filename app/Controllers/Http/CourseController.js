"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Course = use("App/Models/Course");
const sharedController = require("./SharedController");

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
  async index({ auth, response }) {
    try {
      const user_id = await auth.user.id;
      const courses = await Course.query().where("user_id", user_id).fetch();
      if (!courses) {
        return response.status(404).send("No couse was found");
      }
      return response.status(200).send(courses);
    } catch (error) {
      console.log(error)
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
      const errors = sharedController.missingRequirements(
        [title, "title"],
        [grade, "grade"],
        [code, "code"],
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
      course.code = code;
      course.credit_load = credit_load;
      course.semester = semester;
      course.level = level;

      const user = await auth.getUser();
      await user.courses().save(course);

      return response.status(201).send(course);
    } catch (error) {
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
  async show({ params, response }) {
    try {
      const course = await Course.find(params.id);
      if (!course) {
        return response.status(404).send("Course not found");
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
      const course = await Course.findOrFail(params.id);

      course.title = request.body.title || course.title;
      course.grade = request.body.grade || course.grade;
      course.code = request.body.code || course.code;
      course.credit_load = request.body.credit_load || course.credit_load;
      course.semester = request.body.semester || course.semester;
      course.level = request.body.level || course.level;

      await course.save();
      return response.status(200).send(course);
    } catch (error) {
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
  async destroy({ params, request, response }) {
    try {
      const course = await Course.findOrFail(params.id);
      await course.delete();
      return response.send("course deleted successfully");
    } catch (error) {
      return response.status(500).send("An error occured");
    }
  }
}

module.exports = CourseController;
