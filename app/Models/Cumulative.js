"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Cumulative extends Model {
  static get hidden() {
    return ["created_at", "updated_at", "user_id", "id"];
  }
  user() {
    return this.hasOne("App/Models/User");
  }
}

module.exports = Cumulative;
