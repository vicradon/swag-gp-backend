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
   * @swagger
   * /api/v1/courses:
   *   get:
   *     tags:
   *       - Courses
   *     summary: Get a user's courses
   *     parameters:
   *       - name: level
   *         description: A course's level
   *         in: query
   *         required: false
   *         type: string
   *       - name: semester
   *         description: A course's semester
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Return courses
   *         example:
   *           courses: [{ "id": 6, "created_at": "2020-11-21 18:56:33", "updated_at": "2020-11-21 18:56:33", "title": "COurse", "code": "course 101", "grade": "C", "credit_load": 2, "semester": "2", "level": "100", "user_id": 1 },]
   *       404:
   *        description: No course found
   *        example:
   *          courses: []
   */
  async index({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/courses:
   *   get:
   *     tags:
   *       - Courses
   *     summary: Create a new course
   *     parameters:
   *         title,
        grade,
        code,
        credit_load,
        semester,
        level,
   *       - name: title
   *         description: Title of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: grade
   *         description: Grade of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: credit_load
   *         description: credit_load of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: semester
   *         description: Semester where the course falls
   *         in: body
   *         required: true
   *         type: string
   *       - name: level
   *         description: Level where the course falls
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Creates a course
   *         example:
   *           courses: [{ "id": 6, "created_at": "2020-11-21 18:56:33", "updated_at": "2020-11-21 18:56:33", "title": "COurse", "code": "course 101", "grade": "C", "credit_load": 2, "semester": "2", "level": "100", "user_id": 1 },]
   */
  async store({ auth, request, response }) {
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
