class CourseController {
  /**
   * @swagger
   * /api/v1/courses:
   *   get:
   *     tags:
   *       - Courses
   *     summary: Get a user's courses
   *     parameters:
   *       - name: level
   *         description: A course's level
   *         in: query
   *         required: false
   *         type: string
   *       - name: semester
   *         description: A course's semester
   *         in: query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Return courses
   *         example:
   *           courses: [
                  {
                      "id": 6,
                      "title": "COurse",
                      "code": "course 101",
                      "grade": "C",
                      "credit_load": 2,
                      "semester": "2",
                      "level": "100"
                  },
                  {
                      "id": 7,
                      "title": "Some other",
                      "code": "SOM 101",
                      "grade": "A",
                      "credit_load": 3,
                      "semester": "1",
                      "level": "200"
                  }
              ]
   *
   *       404:
   *        description: No course found
   *        example:
   *          courses: []
   */
  async index({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/courses:
   *   post:
   *     tags:
   *       - Courses
   *     summary: Create a new course
   *     parameters:
   *       - name: title
   *         description: Title of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: grade
   *         description: Grade of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: credit_load
   *         description: credit_load of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: semester
   *         description: Semester where the course falls
   *         in: body
   *         required: true
   *         type: string
   *       - name: level
   *         description: Level where the course falls
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Creates a course
   *         example:
   *              {
                      "id": 6,
                      "title": "COurse",
                      "code": "course 101",
                      "grade": "C",
                      "credit_load": 2,
                      "semester": "2",
                      "level": "100"
                  }
   */
  async store({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/courses/:id:
   *   get:
   *     tags:
   *       - Courses
   *     summary: Returns a course
   *     responses:
   *       200:
   *         description: Returns a course
   *         example:
   *              {
                      "id": 6,
                      "title": "COurse",
                      "code": "course 101",
                      "grade": "C",
                      "credit_load": 2,
                      "semester": "2",
                      "level": "100"
                  }
   */
  async show({ auth, params, response }) {}

  /**
   * @swagger
   * /api/v1/courses/:id:
   *   patch:
   *     tags:
   *       - Courses
   *     summary: Updates a course
   *     parameters:
   *       - name: title
   *         description: Title of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: grade
   *         description: Grade of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: credit_load
   *         description: credit_load of the course
   *         in: body
   *         required: true
   *         type: string
   *       - name: semester
   *         description: Semester where the course falls
   *         in: body
   *         required: true
   *         type: string
   *       - name: level
   *         description: Level where the course falls
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Updated course
   *         example:
   *              {
                      "id": 6,
                      "title": "COurse",
                      "code": "course 101",
                      "grade": "C",
                      "credit_load": 2,
                      "semester": "2",
                      "level": "100"
                  }
   */
  async update({ params, request, response }) {}

  /**
   * @swagger
   * /api/v1/courses/:id:
   *   delete:
   *     tags:
   *       - Courses
   *     summary: Deletes a course
   *     responses:
   *       200:
   *         description: deletion response on successful delete
   *         example:
   *            course deleted successfully
   */
  async destroy({ params, response }) {}
}
