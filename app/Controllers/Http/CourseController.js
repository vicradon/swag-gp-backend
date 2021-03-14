"use strict";

const Course = use("App/Models/Course");
const Cumulative = use("App/Models/Cumulative");
const Preference = use("App/Models/Preference");
const { validateAll } = use("Validator");

class CourseController {
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
        courses = await Course.query().where({ user_id, level }).fetch();
      } else if (level && semester) {
        courses = await Course.query()
          .where({ user_id, level, semester })
          .fetch();
      } else {
        courses = await Course.query().where("user_id", user_id).fetch();
      }

      return response.ok(courses);
    } catch (error) {
      console.error(error);
      return response.status(500).send(error);
    }
  }

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

      const course = await Course.create({
        title,
        grade,
        code,
        credit_load,
        semester,
        level,
      });
      const user = await auth.user;
      await user.courses().save(course);
      const cumulative = await this.computeCumulative({
        user,
        semester: course.semester,
        level: course.level,
      });

      return response.status(201).send({ course, ...cumulative });
    } catch (error) {
      console.error(error);
      return response.status(500).send(error);
    }
  }

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

  async isOwner({ auth, course }) {
    const courseOwner = await course.user().fetch();
    const requester = await auth.user;
    if (requester.id !== courseOwner.id) {
      return response.status(404).send("You cannot view another user's course");
    }
  }

  async update({ auth, params, request, response }) {
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

      const courseOwner = await course.user().fetch();
      const requester = await auth.user;
      if (requester.id !== courseOwner.id) {
        return response
          .status(404)
          .send("You cannot view another user's course");
      }

      course.title = title;
      course.grade = grade;
      course.code = code;
      course.credit_load = credit_load;
      course.semester = semester;
      course.level = level;

      await course.save();

      const cumulative = await this.computeCumulative({
        user: courseOwner,
        semester: course.semester,
        level: course.level,
      });
      return response.ok({
        course,
        ...cumulative,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send(error);
    }
  }

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

  totalCreditLoad(courses) {
    return courses.reduce((accumulator, course) => {
      return accumulator + course.credit_load;
    }, 0);
  }

  totalGradePoint(courses, grade_system) {
    return courses.reduce((accumulator, course) => {
      return accumulator + course.credit_load * grade_system[course.grade];
    }, 0);
  }

  async computeCumulative({ user, semester, level }) {
    try {
      const cumulative = await Cumulative.findBy("user_id", user.id);

      const all_courses = (
        await Course.query().where("user_id", user.id).fetch()
      ).toJSON();
      const semester_courses = (
        await Course.query()
          .where({ user_id: user.id, semester, level })
          .fetch()
      ).toJSON();
      const preference = await Preference.findBy("user_id", user.id);
      const grade_system = await preference.gradeSystem().fetch();

      const total_credit_load = this.totalCreditLoad(all_courses);
      const total_grade_point = this.totalGradePoint(all_courses, grade_system);

      const semester_credit_load = this.totalCreditLoad(semester_courses);
      const semester_grade_point = this.totalGradePoint(
        semester_courses,
        grade_system
      );

      cumulative.credit_load = total_credit_load;
      cumulative.grade_point = total_grade_point;
      cumulative.grade_point_average = Number(
        (total_grade_point / total_credit_load).toFixed(2)
      );

      await cumulative.save();

      return {
        semester_cumulative: {
          credit_load: semester_credit_load,
          grade_point: semester_grade_point,
          grade_point_average: Number(
            (semester_grade_point / semester_credit_load).toFixed(2)
          ),
          course_count: semester_courses.length,
        },
        cumulative,
      };
    } catch (error) {
      throw error;
    }
  }

  async fetchCumulative({ request, auth, response }) {
    try {
      const user = await auth.user;

      const { semester, level } = request.all();

      const rules = {
        semester: "required|in:1,2",
        level: "required|in:100,200,300,400,500,600,700,800,900",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const cumulative = await this.computeCumulative({
        user,
        semester,
        level,
      });
      return response.ok(cumulative);
    } catch (error) {
      return response.internalServerError(error.message);
    }
  }
}

module.exports = CourseController;
