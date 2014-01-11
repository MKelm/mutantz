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

MZ.Map = function() {

  this.fieldAmount = { x: 32, y: 32 };
  this.fieldSize = { width: 100, height: 100 };

  this.fieldTypes = [
    { handle: "empty", title: "Empty", block: false }, // 0
    { handle: "floor", title: "Floor", block: false }, // 1
    { handle: "wall", title: "Wall", block: true }, // 2
    { handle: "grid", title: "Grid", block: false } // 2
  ];

  this.loadedFields = null;

  this.fieldSelectionPosition = {x: null, y: null};
}

MZ.Map.prototype.constructor = MZ.Map;

MZ.Map.prototype.load = function() {
  var scope = this;
  mz.storage.loadMapFields(function(fields) { scope.loadFields(fields); });
}

MZ.Map.prototype.loadFields = function(fields) {
  this.loadedFields = [];

  var id = 0, type = null, roomType = null;
  for (var fY = 0; fY < this.fieldAmount.y; fY++) {
    if (typeof this.loadedFields[fY] == "undefined") this.loadedFields[fY] = [];

    for (var fX = 0; fX < this.fieldAmount.x; fX++) {
      type = (typeof fields[id] != "undefined") ? fields[id].type : 0;
      roomType = (typeof fields[id] != "undefined") ? fields[id].roomType : -1;
      construction = (typeof fields[id] != "undefined") ? fields[id].construction : 0;
      this.loadedFields[fY].push(
        { id: id, type: type, visible: false, sprite: null, roomType: roomType, construction: construction }
      );
      if (typeof fields[id] == "undefined") mz.storage.setMapField(id, fX, fY, 0, -1, 0);
      id++;
    }
  }

  mz.game.display.drawMap();
}

MZ.Map.prototype.fieldPositionByMouse = function(mouse) {
  // field detection
  var oEvent = mouse.originalEvent, target = mouse.target;
  // clicked field position depends on mapContainer position (target.parent)
  var clickPosX = (oEvent.layerX - (mz.pixi.screen.width / 2)) / mz.pixi.screen.ratio - target.parent.position.x,
      clickPosY = (oEvent.layerY - (mz.pixi.screen.height / 2)) / mz.pixi.screen.ratio - target.parent.position.y;
  // map field properties and current map container scale
  var fieldX = this.fieldAmount.x / 2  +
               Math.round(clickPosX / target.parent.scale.x / this.fieldSize.width - 0.5),
      fieldY = this.fieldAmount.y / 2 +
               Math.round(clickPosY / target.parent.scale.y / this.fieldSize.height - 0.5);
  return { x: fieldX, y: fieldY };
}

MZ.Map.prototype.fieldSelection = function(mouse, mode) {
  var position = this.fieldPositionByMouse(mouse);
  var fieldSize = mz.game.map.fieldSize;
  switch (mode) {
    case "start":
      this.fieldSelectionPosition = {
        fieldX: position.x, fieldY: position.y,
        x: -1 * mz.game.map.fieldAmount.x * mz.game.map.fieldSize.width / 2 + position.x * fieldSize.width,
        y: -1 * mz.game.map.fieldAmount.y * mz.game.map.fieldSize.height / 2 + position.y * fieldSize.height
      };
      mz.game.display.drawSelection(mode, this.fieldSelectionPosition, fieldSize.width, fieldSize.height);
      break;
    case "move":
      var posX = Math.min(this.fieldSelectionPosition.fieldX, position.x);
      var posY = Math.min(this.fieldSelectionPosition.fieldY, position.y);
      var maxX = Math.max(this.fieldSelectionPosition.fieldX, position.x);
      var maxY = Math.max(this.fieldSelectionPosition.fieldY, position.y);

      var diffX = (maxX-posX) * fieldSize.width, diffY = (maxY-posY) * fieldSize.height;
      mz.game.display.drawSelection(
        mode, {
          x: -1 * mz.game.map.fieldAmount.x * fieldSize.width / 2 + posX * fieldSize.width,
          y: -1 * mz.game.map.fieldAmount.y * fieldSize.height / 2 + posY * fieldSize.height
        },
        diffX + 100, diffY + 100
      );
      break;
    case "end":
      if (mz.game.display.selectedFieldTypeId > -1 || mz.game.display.selectedRoomTypeId > -1) {
        var selectedFields = [];
        var minX = Math.min(this.fieldSelectionPosition.fieldX, position.x),
            maxX = Math.max(this.fieldSelectionPosition.fieldX, position.x),
            minY = Math.min(this.fieldSelectionPosition.fieldY, position.y),
            maxY = Math.max(this.fieldSelectionPosition.fieldY, position.y);

        for (var fY = minY; fY <= maxY; fY++) {
          for (var fX = minX; fX <= maxX; fX++) {

            var field = this.loadedFields[fY][fX];
            // set selected field to new sprite type
            if (mz.game.display.selectedFieldTypeId > -1)
              field.type = mz.game.display.selectedFieldTypeId;
            // set selected field to new room type
            if (mz.game.display.selectedRoomTypeId > -1)
              field.roomType = mz.game.display.selectedRoomTypeId;
            field.construction = 1;
            mz.storage.setMapField(field.id, null, null, field.type, field.roomType, field.construction);
          }
        }
        mz.game.display.drawMap();
      }

      mz.game.display.removeSelection();
      break;
  }
}

MZ.Map.prototype.calculatePath = function (position, targetPosition) {
  var dirX = null, dirY = null, path = [], fields = [], fieldType = null, fieldId = null;

  var calculate = true, steps = 0;
  do {
    // determine directions to go
    dirX = (position.x > targetPosition.x) ? -1 : (position.x == targetPosition.x) ? 0 : 1;
    dirY = (position.y > targetPosition.y) ? -1 : (position.y == targetPosition.y) ? 0 : 1;

    // determine fields to go
    fields = [], rotation = 0;
    if (dirX != 0) {
      // rotation to left or right
      rotation = (dirX == -1) ? 270 : 90;
      fields.push(
        { x: position.x + dirX, y: position.y, rotation: rotation, direction: (dirX == -1) ? "left" : "right" }
      );

    }
    if (dirY != 0) {
      // rotation to up or down
      rotation = (dirY == -1) ? 0 : 180;
      fields.push(
        { x: position.x, y: position.y + dirY, rotation: rotation, direction: (dirY == -1) ? "up" : "down" }
      );
    }
    if (dirX != 0 && dirY != 0) {
      var direction = null;
      if (dirX == -1 && dirY == -1) {
        rotation = 360 - 90 / 2;
        direction = "left/up";
      } else if (dirX == 1 && dirY == 1) {
        rotation = 180 - 90 / 2;
        direction = "right/down";
      } else if (dirX == -1 && dirY == 1) {
        rotation = 180 + 90 / 2;
        direction = "left/down";
      } else if (dirX == 1 && dirY == -1) {
        rotation = 90 / 2;
        direction = "right/up";
      }
      fields.push(
        { x: position.x + dirX, y: position.y + dirY, rotation: rotation, direction: direction }
      );
    }

    // get target field from available fields (optional)
    for (var i = 0; i < fields.length; i++) {
      if (fields[i].x == targetPosition.x && fields[i].y == targetPosition.y) {
        fields = [fields[i]];
      }
    }

    // remove blocked fields
    for (var i = 0; i < fields.length; i++) {
      fieldType = this.loadedFields[fields[i].y][fields[i].x].type;
      if (this.fieldTypes[fieldType].block == true) {
        fields.splice(i, 1);
      }
    }

    // prefer diagonal field
    var directionsToIgnore = ["left", "right", "up", "down"];
    for (var i = 0; i < fields.length; i++) {
      if (directionsToIgnore.indexOf(fields[i].direction) === -1) {
        fields = [fields[i]];
        break;
      }
    }

    // get random direction field
    fieldId = Math.round(Math.random() * (fields.length - 1));

    if (fieldId >= 0) {
      path.push(fields[fieldId]);
      position = fields[fieldId];
    } else {
      calculate = false;
    }

  } while (calculate == true && (position.x != targetPosition.x || position.y != targetPosition.y));

  return path;
}