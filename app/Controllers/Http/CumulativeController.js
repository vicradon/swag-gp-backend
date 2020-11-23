"use strict";

/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Cumulative = use("App/Models/Cumulative");
const Course = use("App/Models/Course");
const Preference = use("App/Models/Preference");

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
      const cumulative = await Cumulative.findBy("user_id", user.id);

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

      const cumulative = await Cumulative.findBy("user_id", user.id);

      const raw_courses = await Course.query()
        .where("user_id", user.id)
        .fetch();
      const courses = JSON.parse(JSON.stringify(raw_courses));
      const preference = await Preference.findBy("user_id", user.id);
      const grade_system = await preference.gradeSystem().fetch();

      const total_credit_load = courses.reduce((accumulator, course) => {
        return accumulator + course.credit_load;
      }, 0);
      const total_grade_point = courses.reduce((accumulator, course) => {
        return accumulator + course.credit_load * grade_system[course.grade];
      }, 0);


      cumulative.credit_load = total_credit_load;
      cumulative.grade_point = total_grade_point;
      cumulative.grade_point_average = Number((total_grade_point / total_credit_load).toFixed(2));

      await cumulative.save();

      return response.status(200).send(cumulative);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error);
    }
  }
}

module.exports = CumulativeController;
