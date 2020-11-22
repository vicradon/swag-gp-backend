"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Preference extends Model {
  static get hidden() {
    return ["created_at", "updated_at"];
  }
  gradeSystem() {
    return this.belongsTo("App/Models/GradeSystem");
  }
}

module.exports = Preference;
