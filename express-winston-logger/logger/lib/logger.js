/*******************************************************************************
 * Copyright (c) 2016 Nicola Del Gobbo 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY
 * IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing
 * permissions and limitations under the License.
 *
 * Contributors - initial API implementation:
 * Nicola Del Gobbo <nicoladelgobbo@gmail.com>
 ******************************************************************************/

'use strict'

// path.join('./logs', 'express-winston' + '-ERROR'),

/*!
 * Module dependencies
 */
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')
const moment = require('moment')
const fs = require('fs-extra')


const DEFAULT_FORMAT_DATE = 'DD-MM-YYYY - HH:mm:ss'
const DEFAULT_DATE_PATTERN = 'DD-MM-YYYY'
const DEFAULT_CONSOLE_LOGGER = true
const DEFAULT_FILE_LOGGER = false
const LABEL = 'MY-SERVICE'

const LEVELS = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
}

function checkOptions(opts = {}) {
  let { formatDate, datePattern } = opts
  formatDate = formatDate ? formatDate : DEFAULT_FORMAT_DATE
  datePattern = datePattern ? datePattern : DEFAULT_DATE_PATTERN
  return {
      formatDate,
      datePattern
  }
}

function buildForConsole(opts) {
  return winston.createLogger({
      format: winston.format.combine(
          winston.format.label({ label: LABEL }),
          winston.format.colorize(),
          winston.format.timestamp(),
          opts.fmt
      ),
      transports: new winston.transports.Console()
  })
}

function printer(formatDate) {
  return winston.format.printf(info => {
      return `${info.label} ## ${moment(info.timestamp).format(formatDate)} ## ${info.level}: ${info.message}`
  })
}

class Logger {

  constructor (opts = {}) {
    const buildOpts = checkOptions(opts)
    // Function to print and serialize the logs for the chosen transport
    buildOpts.fmt = printer(buildOpts.formatDate)
    this.logger = buildForConsole(buildOpts)
  }
  
  error(message) {
    this.logger.error(message)
  }

  warn(message) {
      this.logger.warn(message)
  }

  info(message) {
      this.logger.info(message)
  }

}

module.exports = Logger