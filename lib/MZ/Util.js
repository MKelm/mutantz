/*
 * This file is part of Mutantz.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/nuaox
 *
 * Mutantz is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Mutantz is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mutantz. If not, see <http://www.gnu.org/licenses/>.
 */

MZ.Util = function(loadMode) {
  this.jsons = {};
  this.loadMode = loadMode || "nodejs";
  $.ajaxSetup({ async: false });
}

MZ.Util.prototype.constructor = MZ.Util;

MZ.Util.prototype.getEventListener = function(obj, func) {
  return function(event) { obj[func](obj, event); };
}

MZ.Util.prototype.quit = function(delay) {
  if (typeof delay == "undefined") {
    delay = 0;
  }
  global.setTimeout(function() {
    require('nw.gui').App.closeAllWindows();
  }, delay);
}

MZ.Util.prototype.loadJSON = function(json, forceLoad) {
  var result = {};
  if (typeof this.jsons[json] == "undefined") {
    try {
      if (this.loadMode == "nodejs") {
        result = JSON.parse(require('fs').readFileSync(json, { encoding : "utf8" }));
      } else {
        result = $.parseJSON($.get("../"+json).responseText);
      }
      if (forceLoad !== true) {
        // load json files one time only
        // espacially externals which will be used in multiple data files
        this.jsons[json] = result;
      }
    } catch (err) {
    }
  } else {
    result = this.jsons[json];
  }
  return result;
};

MZ.Util.prototype.objectLength = function(object) {
  var size = 0, key;
  for (key in object) {
    if (object.hasOwnProperty(key)) size++;
  }
  return size;
};

MZ.Util.prototype.time = function(type, delay) {
  var div = 1;
  if (type == "unix") {
    div = 1000;
  }
  if (!delay > 0) {
    delay = 0;
  }
  var t = new Date().getTime() / div;
  if (type != "formated") {
    return Math.round(t + delay);
  } else {
    var date = new Date(t);
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}

MZ.Util.prototype.isoDateTime = function(t) {
  var isoDateTime = new Date(t).toISOString();
  //2014-01-06T11:03:48.455Z
  return isoDateTime.substring(0, 10) + " " + isoDateTime.substring(11, 16);
}

MZ.Util.prototype.isChance = function(p, max) {
  if (typeof max == "undefined") max = 32767;
  // calculates if a chance exists to do something
  var r = Math.random() * max;
  return r < (max * p)
}

MZ.Util.prototype.isRectangesCollision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
  return (x1 <= x2 + w2 &&
          x2 <= x1 + w1 &&
          y1 <= y2 + h2 &&
          y2 <= y1 + h1);
}