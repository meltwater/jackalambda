/* eslint-disable no-global-assign */
require = require('esm')(module, { mode: 'auto' })
module.exports.handle = require('./processor').handle
