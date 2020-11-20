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

      table.integer('semester_id').unsigned().nullable().references('id').inTable('semesters').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('level_id').unsigned().nullable().references('id').inTable('levels').onUpdate('CASCADE').onDelete('CASCADE')
      table.integer('user_id').unsigned().nullable().references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('courses')
  }
}

module.exports = CourseSchema
