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

MZ.Grid = function() {

  this.size = { width: 100, height: 20 };
  this.fieldSize = { width: 50, height: 50 };

  this.fieldSelectionPosition = {};

  this.fieldTypes = [
    { handle: "space", title: "Space", block: false },
    { handle: "block", title: "Block", block: true }
  ];
  this.selectedFieldTypeId = -1;
  this.fields = [];

  this.areaTypes = [
    { handle: "empty", title: "Empty", color: null },
    { handle: "playerStart", title: "Player start", color: 0x25BA00 },
    { handle: "playerEnd", title: "Player end", color: 0xC50E00 },
    { handle: "enemyWalk", title: "Enemy walk", color: 0xCBD70B }
  ];
  this.selectedAreaTypeId = -1;
}

MZ.Grid.prototype.constructor = MZ.Grid;

MZ.Grid.prototype.setFields = function(fields) {
  this.fields = fields;
}

MZ.Grid.prototype.getFields = function(withoutSprite) {
  if (!withoutSprite) return this.fields;
  var fields = [];
  for (var y = 0; y < this.fields.length; y++) {
    fields[y] = [];
    for (var x = 0; x < this.fields[y].length; x++) {
      fields[y][x] = { type: this.fields[y][x].type, areaType: this.fields[y][x].areaType, sprite: null };
    }
  }
  return fields;
}

MZ.Grid.prototype.loadFields = function() {
  // fill grid fields with space by default
  for (var y = 0; y < this.size.height; y++) {
    this.fields[y] = [];
    for (var x = 0; x < this.size.width; x++) {
      this.fields[y][x] = { type: 0, areaType: 0, sprite: null };
    }
  }
}

MZ.Grid.prototype.fieldSelection = function(mode, position) {
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
        diffX + this.fieldSize.width, diffY + this.fieldSize.height
      );
      break;
    case "end":
      if (this.selectedFieldTypeId > -1 || this.selectedAreaTypeId > -1 ||
          mz.game.enemies.selectedEnemyTypeId > -1) {
        var selectedFields = [];
        var minX = Math.min(this.fieldSelectionPosition.fieldX, position.x),
            maxX = Math.max(this.fieldSelectionPosition.fieldX, position.x),
            minY = Math.min(this.fieldSelectionPosition.fieldY, position.y),
            maxY = Math.max(this.fieldSelectionPosition.fieldY, position.y);

        for (var fY = minY; fY <= maxY; fY++) {
          for (var fX = minX; fX <= maxX; fX++) {
            var field = this.fields[fY][fX];

            if (this.selectedFieldTypeId > -1)
              field.type = this.selectedFieldTypeId;
            if (this.selectedAreaTypeId > -1)
              field.areaType = this.selectedAreaTypeId;
            if (mz.game.enemies.selectedEnemyTypeId > -1)
              mz.game.enemies.addEnemy(mz.game.enemies.selectedEnemyTypeId, fX, fY);
          }
        }
        mz.game.display.drawGrid();
        mz.game.display.drawEnemies();
      }
      mz.game.display.removeGridSelection();
      break;
  }
}