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
  this.grid.loadFields();

  var fs = require('fs');
  fs.writeFileSync("./lib/data/levels/"+id+".json", '{ "grid": {} }');
  console.log(fs.existsSync("./lib/data/levels/"+id+".json"));

}

MZ.Level.prototype.constructor = MZ.Level;