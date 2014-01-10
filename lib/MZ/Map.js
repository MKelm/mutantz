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
    { handle: "empty", block: false }, // 0
    { handle: "floor", block: false }, // 1
    { handle: "wall", block: true } // 2
  ];

  this.loadedFields = null;
}

MZ.Map.prototype.constructor = MZ.Map;

MZ.Map.prototype.load = function() {
  var scope = this;
  mz.storage.loadMapFields(function(fields) { scope.loadFields(fields); });
}

MZ.Map.prototype.loadFields = function(fields) {
  this.loadedFields = [];

  var id = 0, type = null;
  for (var fY = 0; fY < this.fieldAmount.y; fY++) {
    if (typeof this.loadedFields[fY] == "undefined") this.loadedFields[fY] = [];

    for (var fX = 0; fX < this.fieldAmount.x; fX++) {
      type = (typeof fields[id] != "undefined") ? fields[id].type : 0;
      this.loadedFields[fY].push({ type: type, visible: false, sprites: null });
      mz.storage.setMapField(id, fX, fY, type);
      id++;
    }
  }

  mz.game.dispatchEvent({
    type: "display-update-map", content: { }
  });
}

MZ.Map.prototype.fieldPositionByMouse = function(mouse) {
  // field detection
  var oEvent = mouse.originalEvent, target = mouse.target;
  // clicked field position depends on mapContainer position (target.parent)
  var clickPosX = ((oEvent.layerX - mz.pixi.screen.width / 2) - target.parent.position.x),
      clickPosY = ((oEvent.layerY - mz.pixi.screen.height / 2) - target.parent.position.y);
  // map field properties and current map container scale
  var fieldX = this.fieldAmount.x / 2 +
               Math.floor(clickPosX / target.parent.scale.x / this.fieldSize.width),
      fieldY = this.fieldAmount.y / 2 +
               Math.floor(clickPosY / target.parent.scale.x / this.fieldSize.height);
  return { x: fieldX, y: fieldY };
}