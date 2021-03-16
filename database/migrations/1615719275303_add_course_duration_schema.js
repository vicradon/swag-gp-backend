"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddCourseDurationSchema extends Schema {
  up() {
    this.table("preferences", (table) => {
      table.integer("duration").nullable();
    });
  }

  down() {
    this.table("preferences", (table) => {
      table.dropColumn("duration");
    });
  }
}

module.exports = AddCourseDurationSchema;
