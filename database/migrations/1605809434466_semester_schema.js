'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SemesterSchema extends Schema {
  up () {
    this.create('semesters', (table) => {
      table.increments()
      table.timestamps()
      table.string('title')
    })
  }

  down () {
    this.drop('semesters')
  }
}

module.exports = SemesterSchema
