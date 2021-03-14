"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddSchoolAndDeptSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.string("school").nullable();
      table.string("department").nullable();
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("school");
      table.dropColumn("department");
    });
  }
}

module.exports = AddSchoolAndDeptSchema;
