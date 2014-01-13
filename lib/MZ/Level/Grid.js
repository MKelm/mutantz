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

MZ.LevelGrid = function() {

  this.size = { width: 10, height: 10 };

  this.fieldTypes = [
    { handle: "space", title: "Space", block: false },
    { handle: "block", title: "Block", block: true }
  ];

  this.fields = [];
}

MZ.LevelGrid.prototype.constructor = MZ.LevelGrid;

MZ.LevelGrid.prototype.setFields = function(fields) {
  this.fields = fields;
}

MZ.LevelGrid.prototype.loadFields = function() {
  // fill grid fields with space by default
  for (var y = 0; y < this.size.height; y++) {
    this.fields[y] = [];
    for (var x = 0; x < this.size.width; x++) {
      this.fields[y][x] = 0;
    }
  }
}