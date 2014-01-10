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

MZ.Display = function() {

  this.container = null;
  this.mapContainer = null;
}

MZ.Display.prototype.constructor = MZ.Display;

MZ.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  mz.pixi.stage.addChild(this.container);
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };

  this.mapContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.mapContainer);

  var scope = this;
  mz.pixi.resizeCallback = function() { scope.handleResize(); };
}

MZ.Display.prototype.handleResize = function() {
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };
}

MZ.Display.prototype.updateMap = function() {
  var x = null, y = -1 * mz.game.map.fieldAmount.y * mz.game.map.fieldSize.height / 2, fieldHandle = null;

  for (var fY = 0; fY < mz.game.map.fieldAmount.y; fY++) {
    x = x = -1 * mz.game.map.fieldAmount.x * mz.game.map.fieldSize.width / 2;
    for (var fX = 0; fX < mz.game.map.fieldAmount.x; fX++) {
      if (mz.game.map.loadedFields[fY][fX].visible == false) {
        // add map field
        fieldHandle = mz.game.map.fieldTypes[mz.game.map.loadedFields[fY][fX].type].handle;
        var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png"));
        sprite.position = { x: x, y: y };
        this.mapContainer.addChild(sprite);

        mz.game.map.loadedFields[fY][fX].visible = true;
      } else {
        // update map field
      }
      x += mz.game.map.fieldSize.width;
    }
    y += mz.game.map.fieldSize.height;
  }

}