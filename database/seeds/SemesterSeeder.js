"use strict";

/*
|--------------------------------------------------------------------------
| SemesterSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Semester = use("App/Models/Semester");

class SemesterSeeder {
  async run() {
    for (let i = 1; i <= 2; i++) {
      const semester = new Semester();
      semester.title = `Semester ${i}`;
      semester.save()
    }
  }
}

module.exports = SemesterSeeder;
