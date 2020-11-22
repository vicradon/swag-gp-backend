class CumulativeController {
  /**
   * @swagger
   * /api/v1/cumulative:
   *   get:
   *     tags:
   *       - Cumulative
   *     summary: Returns a user's cumulative from DB
   *     responses:
   *       200:
   *         description: cumulative object on successful fetch
   *         example:
   *              {
                      "credit_load": 6,
                      "grade_point": 26,
                      "grade_point_average": 4.33
                  }
   */
  async index({ auth, response }) {}

  /**
   * @swagger
   * /api/v1/cumulative:
   *   patch:
   *     tags:
   *       - Cumulative
   *     summary: Computes a user's cumulative and returns it
   *     responses:
   *       200:
   *         description: cumulative object on successful fetch
   *         example:
   *              {
                      "credit_load": 6,
                      "grade_point": 26,
                      "grade_point_average": 4.33
                  }
   */
  async update({ auth, response }) {}
}

module.exports = CumulativeController;
