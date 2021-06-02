/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const RestaurantController = require("../api/controllers/RestaurantController");
const Restaurant = require("../api/models/Restaurant");

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/

  'GET /restaurant/create': 'RestaurantController.create',
  'POST /restaurant/create': 'RestaurantController.create',

  'GET /': 'RestaurantController.list',

  'GET /restaurant': 'RestaurantController.list',

  'GET /restaurant/list': 'RestaurantController.list',

  'GET /restaurant/json': 'RestaurantController.json',

  'GET /restaurant/admin': 'RestaurantController.list2',

  'GET /restaurant/read/:id': 'RestaurantController.read',

  'GET /restaurant/update/:id': 'RestaurantController.update',
  'POST /restaurant/update/:id': 'RestaurantController.update',

  'DELETE /restaurant/:id': 'RestaurantController.delete',

  'GET /restaurant/aginate': 'RestaurantController.aginate',


  'GET /user': 'UserController.login',
  'GET /user/login': 'UserController.login',
  'POST /user/login': 'UserController.login',
  'GET /user/logout': 'UserController.logout',
  'POST /user/logout': 'UserController.logout',

  'GET /restaurant/owned/:id/': 'RestaurantController.populate',
  'GET /user/:id/coupons': 'UserController.populate',
  'POST /user/:id/coupons/add/:fk': 'UserController.add',
  'POST /user/:id/coupons/remove/:fk': 'UserController.remove',

  'GET /user/myredeemed/:id': 'UserController.find',













};
