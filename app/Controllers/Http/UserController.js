"use strict";

const User = use("App/Models/User");
const Preference = use("App/Models/Preference");
const GradeSystem = use("App/Models/GradeSystem");
const Cumulative = use("App/Models/Cumulative");
const { validateAll } = use("Validator");

class UserController {
  async register({ auth, request, response }) {
    try {
      const { email, password, grade_system } = request.all();

      const rules = {
        email: "required|email|unique:users,email",
        password: "required",
        grade_system: "in:4,5",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
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
      const rules = {
        email: "required|email",
        password: "required",
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const authedUser = await auth.withRefreshToken().attempt(email, password);

      return response.status(200).send(authedUser);
    } catch (error) {
      return response.status(404).send(error);
    }
  }

  async show({ auth, response }) {
    try {
      const user = await auth.user;
      return response.status(200).send(user);
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async update({ auth, request, response }) {
    try {
      const { email, firstName, lastName } = request.all();
      const rules = {
        email: "required|email|unique:users,email",
      };
      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const user = await auth.user;
      user.email = email;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      const updatedUser = await user.save();
      return response.status(200).send(updatedUser);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

module.exports = UserController;
