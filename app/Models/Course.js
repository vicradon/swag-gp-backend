"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Course extends Model {
  static get primaryKey() {
    return "uid";
  }
  semester() {
    return this.hasOne("App/Models/Semester");
  }
  level() {
    return this.hasOne("App/Models/Level");
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Course;
