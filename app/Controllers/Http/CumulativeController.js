"use strict";

/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Cumulative = use("App/Models/Cumulative");
const Course = use("App/Models/Course");
const GradeSystem = use("App/Models/GradeSystem");

class CumulativeController {
  /**
   * Show a user's cumulative
   * GET cumulatives
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index({ auth, response }) {
    try {
      const user = await auth.user;
      const cumulative = await Cumulative.findOrCreate(
        { user_id: user.id },
        { units: 0, grade_points: 0, grade_point_average: 0 }
      );
      if (!cumulative.user_id) {
        user.cumulative().save(cumulative);
      }
      return response.status(200).send(cumulative);
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  /**
   * Update cumulative details.
   * PUT or PATCH cumulatives/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ auth, response }) {
    try {
      const user = await auth.user;

      user.gradeSystem().save()

      const cumulative = await Cumulative.findOrCreate(
        { user_id: user.id },
        { units: 0, grade_points: 0, grade_point_average: 0 }
      );

      const courses = await Course.query().where("user_id", user.id).fetch();
      const grade_system = await GradeSystem.findBy('user_id')

      const total_credit_load = courses.reduce((accumulator, course) => {
        return accumulator + course.credit_load
      })
      const total_grade_point = courses.reduce((accumulator, course) => {
        return accumulator + course.credit_load
      })

      // cumulative.units = request.body.units || cumulative.units;
      // cumulative.grade_points =
      //   request.body.grade_points || cumulative.grade_points;
      // cumulative.grade_point_average =
      //   request.body.grade_point_average || cumulative.grade_point_average;

      // if (!cumulative.user_id) {
      //   user.cumulative().save(cumulative);
      // }

      // cumulative.save();

      return response.status(200).send(courses);
    } catch (error) {
      console.log(error)
      return response.status(500).send(error);
    }
  }
}

module.exports = CumulativeController;
