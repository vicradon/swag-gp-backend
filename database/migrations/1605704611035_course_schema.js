'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CourseSchema extends Schema {
  up () {
    this.create('courses', (table) => {
      table.increments()
      table.timestamps()
      table.string('title').notNullable()
      table.enu('grade', ['A', 'B', 'C', 'D', 'F']).notNullable()
      table.integer('credit_load').unsigned().notNullable()
      table.integer('semester').unsigned().references('id').inTable('semesters')
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CourseSchema
