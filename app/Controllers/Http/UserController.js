"use strict";

const Hash = use("Hash");

const User = use("App/Models/User");
const Preference = use("App/Models/Preference");
const GradeSystem = use("App/Models/GradeSystem");
const Cumulative = use("App/Models/Cumulative");
const { validateAll } = use("Validator");

class UserController {
  async register({ auth, request, response }) {
    try {
      const { email, password, grade_system, duration } = request.all();

      const rules = {
        email: "required|email|unique:users,email",
        password: "required",
        grade_system: "required|in:4,5",
        duration: "required|in:2,3,4,5,6,7,8,9",
      };

      const validation = await validateAll(request.all(), rules, {
        "email.unique": "Email is already in use",
      });

      if (validation.fails()) {
        return response.badRequest({
          success: false,
          message: validation.messages(),
        });
      }

      const user = await User.create({
        email,
        password,
      });

      const gradeSystemInstance = await GradeSystem.findBy(
        "point",
        grade_system | "5"
      );
      const preference = new Preference();
      const cumulative = await Cumulative.create({
        credit_load: 0,
        grade_point: 0,
        grade_point_average: 0,
      });
      preference.duration = duration;
      await preference.gradeSystem().associate(gradeSystemInstance);
      await user.preference().save(preference);
      await user.cumulative().save(cumulative);

      const authedUser = await auth.withRefreshToken().attempt(email, password);
      return response.status(201).send({
        ...authedUser,
        success: true,
        message: "user registered successfully",
      });
    } catch (error) {
      console.error(error);
      return response.status(500).send(error.message);
    }
  }

  async login({ auth, request, response }) {
    try {
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
      if (error.message.includes("E_USER_NOT_FOUND")) {
        return response.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      return response.status(404).send(error.message);
    }
  }

  async show({ auth, params, response }) {
    try {
      const user = await auth.user;

      if (user.isAdmin) {
        const rules = {
          id: "required",
        };

        const validation = await validateAll(request.all(), rules);

        if (validation.fails()) {
          return response.badRequest({
            success: false,
            message: "id parameter was not supplied",
            validation_message: validation.messages(),
          });
        }

        const requestedUser = await User.find(params.id);
        return response.ok({
          sucess: true,
          message: "fetched user successfully",
          requestedUser,
        });
      }
      return response.unauthorized({
        success: false,
        message: "You are not authorized to view another user's details",
      });
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async fetchProfileDetails({ auth, response }) {
    try {
      const user = await auth.user;
      const preferences = await user.preference().fetch();

      return response.ok({
        success: true,
        message: "successfully  fetched profile details",
        user,
        duration: preferences.duration,
      });
    } catch (error) {
      return response.internalServerError(error.message);
    }
  }

  async updateProfile({ auth, request, response }) {
    try {
      const { firstName, lastName, department, school } = request.all();

      const user = await auth.user;
      user.firstName = firstName;
      user.lastName = lastName;
      user.department = department;
      user.school = school;

      await user.save();
      return response.ok({
        success: true,
        message: "updated user profile",
        user,
      });
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: error.message,
      });
    }
  }

  async updateEmail({ auth, request, response }) {
    try {
      const { email } = request.all();
      const rules = {
        email: "required|email|unique:users,email",
      };
      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const user = await auth.user;
      user.email = email;

      await user.save();
      return response.status(200).send(user);
    } catch (error) {
      return response.status(500).send(error);
    }
  }

  async updatePassword({ auth, request, response }) {
    try {
      const { currentPassword, newPassword } = request.all();
      const rules = {
        currentPassword: "required",
        newPassword: "required",
      };
      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(400).send(validation.messages());
      }

      const user = await auth.user;
      const passwordsMatch = await Hash.verify(currentPassword, user.password);

      if (!passwordsMatch) {
        return response.status(400).send("Supplied password is wrong");
      }

      user.password = newPassword;

      await user.save();
      return response.status(200).send(user);
    } catch (error) {
      return response.status(500).send(error);
    }
  }
}

module.exports = UserController;
