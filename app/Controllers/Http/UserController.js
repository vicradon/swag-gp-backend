"use strict";
const User = use("App/Models/User");

class UserController {
  async register({ request, response }) {
    try {
      const { username, email, password } = request.all();
      const errors = [];
      if (!username) {
        errors.push("Missing username");
      }
      if (!email) {
        errors.push("Missing email");
      }
      if (!password) {
        errors.push("Missing password");
      }
      if (errors.length) {
        return response
          .status(400)
          .send(`Invalid request. ${errors.join(" ")}`);
      }

      const user = new User();

      user.username = username;
      user.email = email;
      user.password = password;

      await user.save();
      await auth.attempt(email, password);
    } catch (error) {
      console.log(error);
      return response.status(500).send(error.message);
    }
  }

  async login({ auth, request, response }) {
    try {
      // const { email, password } = JSON.parse(request.all().body);
      const { email, password } = request.all();
      const a = await auth.withRefreshToken().attempt(email, password);

      return a;
    } catch (error) {
      console.log(error.message)
      return response.status(404).send(error.message.split(':')[0]);
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
