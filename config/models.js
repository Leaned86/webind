/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  /***************************************************************************
   *                                                                          *
   * Your app's default connection. i.e. the name of one of your app's        *
   * connections (see `config/connections.js`)                                *
   *                                                                          *
   ***************************************************************************/
  connection: 'someMongodbServer',

  /***************************************************************************
   *                                                                          *
   * How and whether Sails will attempt to automatically rebuild the          *
   * tables/collections/etc. in your schema.                                  *
   *                                                                          *
   * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
   *                                                                          *
   ***************************************************************************/
  migrate: 'alter'
  //  migrate: 'safe'
 // migrate: 'drop' //activar cuando se llene la bd con faker y desactivar la anterior

};
