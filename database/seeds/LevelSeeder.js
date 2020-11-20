'use strict'

/*
|--------------------------------------------------------------------------
| LevelSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/


const Level = use('App/Models/Level')

class LevelSeeder {
  async run () {
    for (let i = 1; i < 9; i++){
      const level = new Level()
      level.title = i*100
      await level.save()
    }
  }
}

module.exports = LevelSeeder
