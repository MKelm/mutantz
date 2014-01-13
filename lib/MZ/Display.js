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

  this.gridContainer = null;
  this.gridInteractionSprite = null;
  this.gridSelectionGfx = null;

  this.initialize();
}

MZ.Display.prototype.constructor = MZ.Display;

MZ.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  mz.pixi.stage.addChild(this.container);
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };

  this.gridContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.gridContainer);

  this.gridSelectionGfx = new PIXI.Graphics();
  this.container.addChild(this.gridSelectionGfx);

  var scope = this;
  mz.pixi.resizeCallback = function() { scope.handleResize(); };
}

MZ.Display.prototype.handleResize = function() {
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };
}

MZ.Display.prototype.activateGridZoom = function() {
  var scope = this;
  $('html').bind('mousewheel', function(e) {
    if (e.originalEvent.wheelDelta / 120 > 0 && scope.gridContainer.scale.x < 1.9) {
      scope.gridContainer.scale.x += 0.1;
      scope.gridContainer.scale.y += 0.1;
      scope.gridSelectionGfx.scale.x += 0.1;
      scope.gridSelectionGfx.scale.y += 0.1;
    } else if (scope.gridContainer.scale.x > 0.3) {
      scope.gridContainer.scale.x -= 0.1;
      scope.gridContainer.scale.y -= 0.1;
      scope.gridSelectionGfx.scale.x -= 0.1;
      scope.gridSelectionGfx.scale.y -= 0.1;
    }
  });
}

MZ.Display.prototype.gridFieldPositionByMouse = function(mouse) {
  // field detection
  var oEvent = mouse.originalEvent, target = mouse.target;
  // clicked field position depends on mapContainer position (target.parent)
  var clickPosX = (oEvent.layerX - (mz.pixi.screen.width / 2)) / mz.pixi.screen.ratio - target.parent.position.x,
      clickPosY = (oEvent.layerY - (mz.pixi.screen.height / 2)) / mz.pixi.screen.ratio - target.parent.position.y;
  // map field properties and current map container scale
  var grid = mz.game.level.grid;
  var fieldX = grid.size.width / 2  +
               Math.round(clickPosX / target.parent.scale.x / grid.fieldSize.width - 0.5),
      fieldY = grid.size.height / 2 +
               Math.round(clickPosY / target.parent.scale.y / grid.fieldSize.height - 0.5);
  return { x: fieldX, y: fieldY };
}

MZ.Display.prototype.moveGrid = function(change) {
  this.gridContainer.position.x += change.x;
  this.gridContainer.position.y += change.y;
  this.gridSelectionGfx.position.x += change.x;
  this.gridSelectionGfx.position.y += change.y;
}

MZ.Display.prototype.drawGrid = function() {
  var grid = mz.game.level.grid, field = null, fieldHandle = null,
      startX = x = -1 * grid.size.width / 2 * grid.fieldSize.width, x = startX,
      startY = -1 * grid.size.height / 2 * grid.fieldSize.width, y = startY;

  for (var fY = 0; fY < grid.size.height; fY++) {
    x = startX;
    for (var fX = 0; fX < grid.size.width; fX++) {
      field = grid.fields[fY][fX];
      fieldHandle = grid.fieldTypes[field.type].handle;
      if (fieldHandle == "space" && mz.game.isEditor == true) fieldHandle = "space_editor";

      if (field.sprite === null) {
        // add map field
        var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png"));
        sprite.position = { x: x, y: y };
        this.gridContainer.addChild(sprite);
        field.sprite = sprite;

      } else {
        // update map field
        field.sprite.setTexture(
          new PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png")
        );
      }
      x += grid.fieldSize.width;
    }
    y += grid.fieldSize.height;
  }

  if (this.gridInteractionSprite === null) {
    this.gridInteractionSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/blank.png"));
    this.gridInteractionSprite.position = { x: startX, y: startY };
    this.gridInteractionSprite.width = grid.fieldSize.width * grid.size.width;
    this.gridInteractionSprite.height = grid.fieldSize.height * grid.size.height;
    this.gridContainer.addChild(this.gridInteractionSprite);

    this.gridInteractionSprite.setInteractive(true);
    this.gridInteractionSprite.mousedown = function(mouse) {
      mz.game.dispatchEvent( { type: 'display-grid-mousedown', content: { mouse: mouse } } );
    };
    this.gridInteractionSprite.mouseup = function(mouse) {
      mz.game.dispatchEvent( { type: 'display-grid-mouseup', content: { mouse: mouse } } );
    };
  }
}

MZ.Display.prototype.drawGridSelection = function(mode, position, width, height) {
  if (mode != "start") this.gridSelectionGfx.clear();
  this.gridSelectionGfx.lineStyle(2 * Math.min(this.gridContainer.scale.x, this.gridContainer.scale.y), 0xFFDD3F);
  this.gridSelectionGfx.drawRect(position.x, position.y, width, height);
}

MZ.Display.prototype.removeGridSelection = function() {
  this.gridSelectionGfx.clear();
}