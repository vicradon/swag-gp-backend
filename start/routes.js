"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.post("register", "UserController.register").middleware("guest");
Route.post("login", "UserController.login").middleware("guest");
Route.patch('/users/:id', 'UserController.update').middleware(["auth"]);


Route.resource("courses", "CourseController").apiOnly().middleware(["auth"]);

Route.get("cumulative", "CumulativeController.index")
  .middleware(["auth"]);
Route.patch("cumulative", "CumulativeController.update")
  .middleware(["auth"]);
