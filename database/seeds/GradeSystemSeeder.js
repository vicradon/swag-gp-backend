"use strict";

const GradeSystem = use("App/Models/GradeSystem");

class GradeSystemSeeder {
  async run() {
    const nums = [4, 5];
    for (let num of nums) {
      const system = new GradeSystem();
      system.title = `${num} Point System`;
      system.point = num;

      ['A', 'B', 'C', 'D'].map((grade, index) => {
        system[grade] = num - index
      })

      system['E'] = null
      system['F'] = 0

      await system.save();
    }
  }
}

module.exports = GradeSystemSeeder;
