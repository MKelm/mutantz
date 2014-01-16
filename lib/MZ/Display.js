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
  this.gridFieldsContainer = null;
  this.gridObjectsContainer = null;

  this.playerSprite = null;

  // editor layers
  this.gridInteractionSprite = null;
  this.gridAreasGfx = null;
  this.gridSelectionGfx = null;
  this.levelStatusText = null;
}

MZ.Display.prototype.constructor = MZ.Display;

MZ.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  mz.pixi.stage.addChild(this.container);
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };

  this.gridContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.gridContainer);

  this.gridFieldsContainer = new PIXI.DisplayObjectContainer();
  this.gridContainer.addChild(this.gridFieldsContainer);

  if (mz.game.isEditor == true) {
    this.gridAreasGfx = new PIXI.Graphics();
    this.gridAreasGfx.alpha = 0.5;
    this.gridContainer.addChild(this.gridAreasGfx);
  }

  this.gridObjectsContainer = new PIXI.DisplayObjectContainer();
  this.gridContainer.addChild(this.gridObjectsContainer);

  if (mz.game.isEditor == true) {
    this.gridSelectionGfx = new PIXI.Graphics();
    this.gridContainer.addChild(this.gridSelectionGfx);

    this.gridInteractionSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/blank.png"));
    this.gridContainer.addChild(this.gridInteractionSprite);
  }

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
    } else if (scope.gridContainer.scale.x > 0.3) {
      scope.gridContainer.scale.x -= 0.1;
      scope.gridContainer.scale.y -= 0.1;
    }
  });
}

MZ.Display.prototype.moveGrid = function(change) {
  this.gridContainer.position.x += change.x;
  this.gridContainer.position.y += change.y;
}

MZ.Display.prototype.moveGridToPlayer = function() {
  var grid = mz.game.grid;
  for (var fY = 0; fY < grid.size.height; fY++) {
    for (var fX = 0; fX < grid.size.width; fX++) {
      if (typeof grid.fields[fY] != "undefined" && typeof grid.fields[fY][fX] != "undefined" &&
          grid.fields[fY][fX].areaType == 1) {

       this.gridContainer.position.x = -1 * grid.fields[fY][fX].sprite.position.x;
       this.gridContainer.position.y = -1 * grid.fields[fY][fX].sprite.position.y;
      }
    }
  }
}

MZ.Display.prototype.gridFieldPositionByMouse = function(mouse) {
  // field detection
  var oEvent = mouse.originalEvent, target = mouse.target;
  // clicked field position depends on mapContainer position (target.parent)
  var clickPosX = (oEvent.layerX - (mz.pixi.screen.width / 2)) / mz.pixi.screen.ratio - target.parent.position.x,
      clickPosY = (oEvent.layerY - (mz.pixi.screen.height / 2)) / mz.pixi.screen.ratio - target.parent.position.y;
  // map field properties and current map container scale
  var grid = mz.game.grid;
  var fieldX = grid.size.width / 2  +
               Math.round(clickPosX / target.parent.scale.x / grid.fieldSize.width - 0.5),
      fieldY = grid.size.height / 2 +
               Math.round(clickPosY / target.parent.scale.y / grid.fieldSize.height - 0.5);
  return { x: fieldX, y: fieldY };
}

MZ.Display.prototype.drawGrid = function() {
  var grid = mz.game.grid, field = null, fieldHandle = null,
      startX = x = -1 * grid.size.width / 2 * grid.fieldSize.width, x = startX,
      startY = -1 * grid.size.height / 2 * grid.fieldSize.height, y = startY;

  if (mz.game.isEditor) this.gridAreasGfx.clear();
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
        sprite.width = grid.fieldSize.width;
        sprite.height = grid.fieldSize.height;
        this.gridFieldsContainer.addChild(sprite);
        field.sprite = sprite;

      } else {
        // update map field
        field.sprite.setTexture(
          new PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png")
        );
      }

      if (mz.game.isEditor && grid.fields[fY][fX].areaType > 0) {
        this.gridAreasGfx.beginFill(grid.areaTypes[grid.fields[fY][fX].areaType].color);
        this.gridAreasGfx.drawRect(x, y, grid.fieldSize.width, grid.fieldSize.height);
        this.gridAreasGfx.endFill();
      }
      x += grid.fieldSize.width;
    }
    y += grid.fieldSize.height;
  }
}

MZ.Display.prototype.initializeGridInteraction = function() {
  var grid = mz.game.grid, startX = x = -1 * grid.size.width / 2 * grid.fieldSize.width,
      startY = -1 * grid.size.height / 2 * grid.fieldSize.height;

  this.gridInteractionSprite.position = { x: startX, y: startY };
  this.gridInteractionSprite.width = grid.fieldSize.width * grid.size.width;
  this.gridInteractionSprite.height = grid.fieldSize.height * grid.size.height;

  this.gridInteractionSprite.setInteractive(true);
  this.gridInteractionSprite.mousedown = function(mouse) {
    mz.game.dispatchEvent( { type: 'display-grid-mousedown', content: { mouse: mouse } } );
  };
  this.gridInteractionSprite.mouseup = function(mouse) {
    mz.game.dispatchEvent( { type: 'display-grid-mouseup', content: { mouse: mouse } } );
  };
}

MZ.Display.prototype.drawGridSelection = function(mode, position, width, height) {
  if (mode != "start") this.gridSelectionGfx.clear();
  this.gridSelectionGfx.lineStyle(2 * Math.min(this.gridContainer.scale.x, this.gridContainer.scale.y), 0xFFDD3F);
  this.gridSelectionGfx.drawRect(position.x, position.y, width, height);
}

MZ.Display.prototype.removeGridSelection = function() {
  this.gridSelectionGfx.clear();
}

MZ.Display.prototype.drawEnemies = function() {
  var sprite = null, enemy = null, grid = mz.game.grid, enemyType = null;
  for (var i = 0; i < mz.game.enemies.list.length; i++) {
    enemy = mz.game.enemies.list[i];
    if (mz.game.enemies.list[i].sprite === null) {
      enemyType = mz.game.enemies.types[enemy.type];
      sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/enemy_"+enemyType.handle+".png"));
      sprite.position = {
        x: -1 * grid.size.width / 2 * grid.fieldSize.width + enemy.position.x * grid.fieldSize.width,
        y: -1 * grid.size.height / 2 * grid.fieldSize.height + enemy.position.y * grid.fieldSize.height
      };
      sprite.width = grid.fieldSize.width;
      sprite.height = grid.fieldSize.height;
      this.gridObjectsContainer.addChild(sprite);
      mz.game.enemies.list[i].sprite = sprite;
    }
  }
}

MZ.Display.prototype.removeEnemy = function(enemy) {
  if (enemy.sprite !== null && this.gridObjectsContainer.children.indexOf(enemy.sprite) !== -1)
    this.gridObjectsContainer.removeChild(enemy.sprite);
}

MZ.Display.prototype.clear = function(mode) {
  if (mode == "grid") {
    var gridFields = mz.game.grid.fields;
    for (var fY = 0; fY < gridFields.length; fY++) {
      for (var fX = 0; fX < gridFields[fY].length; fX++) {
        if (this.gridFieldsContainer.children.indexOf(gridFields[fY][fX].sprite) !== -1)
          this.gridFieldsContainer.removeChild(gridFields[fY][fX].sprite);
      }
    }

  } else if (mode == "enemies") {
    var enemiesList = mz.game.enemies.list;
    for (var i = 0; i < enemiesList.length; i++) {
      if (this.gridObjectsContainer.children.indexOf(enemiesList[i].sprite) !== -1)
        this.gridObjectsContainer.removeChild(enemiesList[i].sprite);
    }
  }
}

MZ.Display.prototype.drawLevelStatus = function() {
  if (this.levelStatusText === null) {
    var style = {font: 18 + "px " + "Arial", fill: "FFFFFF"};
    var tStatus = new PIXI.Text("Level: "+mz.game.currentLevelId, style);
    tStatus.position = {
      x: -1 * mz.pixi.screen.width/2 - 10,
      y: -1 * mz.pixi.screen.height/2 - 10
    };
    this.container.addChild(tStatus);
    this.levelStatusText = tStatus;
  } else {
    this.levelStatusText.setText("Level: "+mz.game.currentLevelId);
  }
}

MZ.Display.prototype.drawPlayer = function() {
  var grid = mz.game.grid;
  this.playerSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/player.png"));
  this.playerSprite.position = {
    x: 0, y: -1 * grid.fieldSize.width
  };
  this.playerSprite.width = grid.fieldSize.width;
  this.playerSprite.height = grid.fieldSize.height * 2;
  this.container.addChild(this.playerSprite);

}