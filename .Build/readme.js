require('@js/core')
let Fs = require('fs')
let Path = require('path')

let template = require('./templates/readme')(JSON.parse(Fs.readFileSync('tmp/ast', 'utf-8')))


