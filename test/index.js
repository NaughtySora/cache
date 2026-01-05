'use strict';

const path = require('node:path');
const fs = require('node:fs');

for (const file of fs.readdirSync(__dirname)) {
  require(path.resolve(__dirname, file));
}