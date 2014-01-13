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

MZ.Level = function(id) {

  this.id = id;
  this.grid = new MZ.LevelGrid();
  this.load();
  this.save();
}

MZ.Level.prototype.constructor = MZ.Level;

MZ.Level.prototype.save = function() {
  if (this.grid.fields.length > 0) {
    var obj = {
      id: this.id,
      gridFields: this.grid.fields
    };

    var fs = require('fs');
    fs.writeFileSync("./lib/data/levels/"+this.id+".json", JSON.stringify(obj));
  }
}

MZ.Level.prototype.load = function() {
  var fileName = "./lib/data/levels/"+this.id+".json", fs = require('fs');

  if (fs.existsSync(fileName)) {
    var level = JSON.parse(fs.readFileSync(fileName, { encoding: "utf8" }));
    this.grid.setFields(level.gridFields);
  } else {
    this.grid.loadFields();
  }
}