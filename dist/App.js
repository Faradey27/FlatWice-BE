'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _errorhandler = require('errorhandler');

var _errorhandler2 = _interopRequireDefault(_errorhandler);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App {
  constructor() {
    this.app = (0, _express2.default)();
    this._setMiddlewares();
    this._setMetaParams();
  }

  _setMiddlewares() {
    this.app.use((0, _compression2.default)());
    this.app.use(_bodyParser2.default.json());
    this.app.use(_bodyParser2.default.urlencoded({ extended: true }));
    this.app.use((0, _errorhandler2.default)());
  }

  _setMetaParams() {
    this.app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
    this.app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081);
  }

  run() {
    this.app.listen(this.app.get('port'), () => {
      console.log('%s App is running at http://localhost:%d in %s mode', _chalk2.default.green('✓'), this.app.get('port'), this.app.get('env'));
      console.log('  Press CTRL-C to stop\n');
    });
  }
}

exports.default = App;
//# sourceMappingURL=App.js.map