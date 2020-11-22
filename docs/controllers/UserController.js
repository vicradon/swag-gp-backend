class UserController {
  /**
   * @swagger
   * /api/v1/register:
   *   post:
   *     tags:
   *       - User
   *     summary: Registers a new user
   *     parameters:
   *       - name: email
   *         description: New user's email
   *         in: body
   *         required: true
   *         type: string
   *       - name: password
   *         description: New user's password
   *         in: body
   *         required: true
   *         type: string
   *       - name: grade_system
   *         description: The grade system (either 4 point or 5)
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Saves the new user to the DB and returns their tokens
   *         example:
   *            {
                    "type": "bearer",
                    "token": "<token>",
                    "refreshToken": "<refresh_token>"
                }
   */
  async register({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/login:
   *   post:
   *     tags:
   *       - User
   *     summary: Returns a user's tokens
   *     parameters:
   *       - name: email
   *         description: User's email
   *         in: body
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Returns the user's tokens
   *         example:
   *            {
                    "type": "bearer",
                    "token": "<token>",
                    "refreshToken": "<refresh_token>"
                }
   */
  async login({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/users/:id:
   *   get:
   *     tags:
   *       - User
   *     summary: Returns a user email, first and last name
   *     responses:
   *       200:
   *         description: Returns a user email, first and last name
   *         example:
   *            {
                    "firstName": null,
                    "lastName": null,
                    "email": "test29.dev@gmail.com"
                }
   */
  async show({ auth, response }) {}

  /**
   * @swagger
   * /api/v1/users/:id:
   *   patch:
   *     tags:
   *       - User
   *     summary: Returns the user's updated details
   *     parameters:
   *       - name: email
   *         description: User's email
   *         in: body
   *         required: true
   *         type: string
   *       - name: firstName
   *         description: User's firstName
   *         in: body
   *         required: false
   *         type: string
   *       - name: lastName
   *         description: User's lastName
   *         in: body
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Returns the user's updated details
   *         example:
   *            {
                    "firstName": some,
                    "lastName":  name,
                    "email": "test30.dev@gmail.com"
                }
   */
  async update({ auth, request, response }) {}
}
