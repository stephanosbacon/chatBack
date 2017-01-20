/**
 * configType - dev, testClient, prod - there should be a file in '.' called config-<configType>.js
 * The config files assume that they have access to the global functions abs_path and include defined
 * herein.
 */
function config(configType) {

  let base_dir = process.cwd();

  global.abs_path = function (path) {
    return base_dir + '/' + path;
  }
  global.include = function (file) {
    return require(abs_path(file));
  }

  /**
   * Normalize a port into a number, string, or false.
   */

  global.config = include('config/config-' + configType + '.js');
  global.config.include = global.include;
  global.config.abs_path = global.abs_path;

  return global.config;
}

module.exports = config;
