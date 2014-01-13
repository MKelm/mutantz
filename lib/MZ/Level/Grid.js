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
  this.fieldSize = { width: 100, height: 100 };

  this.fieldSelectionPosition = {};
  this.selectedFieldTypeId = -1;

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

MZ.LevelGrid.prototype.getFields = function(withoutSprite) {
  if (!withoutSprite) return this.fields;
  var fields = [];
  for (var y = 0; y < this.fields.length; y++) {
    fields[y] = [];
    for (var x = 0; x < this.fields[y].length; x++) {
      fields[y][x] = { type: this.fields[y][x].type, sprite: null };
    }
  }
  return fields;
}

MZ.LevelGrid.prototype.loadFields = function() {
  // fill grid fields with space by default
  for (var y = 0; y < this.size.height; y++) {
    this.fields[y] = [];
    for (var x = 0; x < this.size.width; x++) {
      this.fields[y][x] = { type: 0, sprite: null };
    }
  }
}

MZ.LevelGrid.prototype.fieldSelection = function(mode, position) {
  switch (mode) {
    case "start":
      this.fieldSelectionPosition = {
        fieldX: position.x, fieldY: position.y,
        x: -1 * this.size.width * this.fieldSize.width / 2 + position.x * this.fieldSize.width,
        y: -1 * this.size.height * this.fieldSize.height / 2 + position.y * this.fieldSize.height
      };
      mz.game.display.drawGridSelection(
        mode, this.fieldSelectionPosition, this.fieldSize.width, this.fieldSize.height
      );
      break;
    case "move":
      var posX = Math.min(this.fieldSelectionPosition.fieldX, position.x);
      var posY = Math.min(this.fieldSelectionPosition.fieldY, position.y);
      var maxX = Math.max(this.fieldSelectionPosition.fieldX, position.x);
      var maxY = Math.max(this.fieldSelectionPosition.fieldY, position.y);

      var diffX = (maxX-posX) * this.fieldSize.width, diffY = (maxY-posY) * this.fieldSize.height;
      mz.game.display.drawGridSelection(
        mode, {
          x: -1 * this.size.width * this.fieldSize.width / 2 + posX * this.fieldSize.width,
          y: -1 * this.size.height * this.fieldSize.height / 2 + posY * this.fieldSize.height
        },
        diffX + 100, diffY + 100
      );
      break;
    case "end":
      if (this.selectedFieldTypeId > -1) {
        var selectedFields = [];
        var minX = Math.min(this.fieldSelectionPosition.fieldX, position.x),
            maxX = Math.max(this.fieldSelectionPosition.fieldX, position.x),
            minY = Math.min(this.fieldSelectionPosition.fieldY, position.y),
            maxY = Math.max(this.fieldSelectionPosition.fieldY, position.y);

        for (var fY = minY; fY <= maxY; fY++) {
          for (var fX = minX; fX <= maxX; fX++) {

            var field = this.fields[fY][fX], fieldChange = false;
            // set selected field to new sprite type
            if (this.selectedFieldTypeId > -1) {
              field.type = this.selectedFieldTypeId;
            }
          }
        }
        mz.game.display.drawGrid();
      }
      mz.game.display.removeGridSelection();
      break;
  }
}