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
   * /api/v1/users/profile:
   *   get:
   *     tags:
   *       - User
   *     summary: Returns a user's profile (email, first and last name)
   *     responses:
   *       200:
   *         description: Returns a user's profile (email, first and last name)
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
   * /api/v1/users/profile:
   *   patch:
   *     tags:
   *       - User
   *     summary: Updates a user's basic profile
   *     parameters:
   *       - name: firstName
   *         description: User's firstName
   *         in: body
   *         required: true
   *         type: string
   *       - name: lastName
   *         description: User's lastName
   *         in: body
   *         required: true
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
  async updateProfile({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/users/email:
   *   patch:
   *     tags:
   *       - User
   *     summary: Updates a user's email address
   *     parameters:
   *       - name: email
   *         description: User's email
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Returns the user's profile
   *         example:
   *            {
                    "firstName": some,
                    "lastName":  name,
                    "email": "test30.dev@gmail.com"
                }
   */
  async updateEmail({ auth, request, response }) {}

  /**
   * @swagger
   * /api/v1/users/password:
   *   patch:
   *     tags:
   *       - User
   *     summary: Updates a user's password
   *     parameters:
   *       - name: currentPassword
   *         description: User's current password
   *         in: body
   *         required: true
   *         type: string
   *       - name: newPassword
   *         description: User's new password
   *         in: body
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: Returns the user's profile
   *         example:
   *            {
                    "firstName": some,
                    "lastName":  name,
                    "email": "test30.dev@gmail.com"
                }
   */
  async updatePassword({ auth, request, response }) {}
}
