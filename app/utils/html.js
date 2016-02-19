'use strict';

/**
 * HTML utilities
 */
module.exports = {

  /**
   * Convert newlines to break tags
   */
  nl2br: function(str, isXhtml) {
    let breakTag = isXhtml ? '<br />' : '<br>';
    return String(str)
      .replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
  }
};
