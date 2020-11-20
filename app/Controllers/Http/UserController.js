"use strict";

const User = use("App/Models/User");
const Preference = use("App/Models/Preference");
const GradeSystem = use("App/Models/GradeSystem");
const Cumulative = use("App/Models/Cumulative");

class UserController {
  async register({ auth, request, response }) {
    try {
      const { username, email, password, grade_system } = request.all();
      const errors = [];

      if (!email) {
        errors.push("Missing email");
      }
      if (!password) {
        errors.push("Missing password");
      }
      if (!grade_system) {
        errors.push("Missing grade system");
      }
      if (errors.length) {
        return response
          .status(400)
          .send(`Invalid request. ${errors.join(" ")}`);
      }

      const user = new User();

      user.email = email;
      user.password = password;

      const gradeSystemInstance = await GradeSystem.findBy(
        "point",
        grade_system
      );
      const preference = new Preference();
      const cumulative = new Cumulative();
      cumulative.credit_load = 0;
      cumulative.grade_point = 0;
      cumulative.grade_point_average = 0;

      await preference.gradeSystem().associate(gradeSystemInstance);
      await user.preference().save(preference);
      await user.cumulative().save(cumulative);

      const authedUser = await auth.withRefreshToken().attempt(email, password);
      return response.status(201).send(authedUser);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  }

  async login({ auth, request, response }) {
    try {
      // const { email, password } = JSON.parse(request.all().body);
      const { email, password } = request.all();
      const authedUser = await auth.withRefreshToken().attempt(email, password);

      return response.status(200).send(authedUser);
    } catch (error) {
      console.log(error.message);
      return response.status(404).send(error.message.split(":")[0]);
    }
  }

  async logout({ auth }) {
    await auth.logout();

    return "Logged out successfully";
  }

  show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return "You cannot see someone else's profile";
    }
    return auth.user;
  }
}

module.exports = UserController;
