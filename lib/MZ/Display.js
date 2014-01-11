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
  this.mapInteractionSprite = null;

  this.mapRoomsGfx = null;

  this.objectsContainer = null;

  this.selectedFieldTypeId = -1;
  this.selectedRoomTypeId = -1;
  this.mapSelectionGfx = null;
}

MZ.Display.prototype.constructor = MZ.Display;

MZ.Display.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  mz.pixi.stage.addChild(this.container);
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };

  this.mapContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.mapContainer);

  this.mapRoomsGfx = new PIXI.Graphics();
  this.mapRoomsGfx.alpha = 0.25;
  this.container.addChild(this.mapRoomsGfx);

  this.objectsContainer = new PIXI.DisplayObjectContainer();
  this.container.addChild(this.objectsContainer);

  this.mapSelectionGfx = new PIXI.Graphics();
  this.container.addChild(this.mapSelectionGfx);

  var scope = this;
  mz.pixi.resizeCallback = function() { scope.handleResize(); };
}

MZ.Display.prototype.handleResize = function() {
  this.container.scale = {x: mz.pixi.screen.ratio, y: mz.pixi.screen.ratio};
  this.container.position = {x: mz.pixi.screen.width/2, y: mz.pixi.screen.height/2 };
}

MZ.Display.prototype.activateMapZoom = function() {
  var scope = this;
  $('html').bind('mousewheel', function(e) {
    if (e.originalEvent.wheelDelta / 120 > 0 &&
        scope.mapContainer.scale.x < 1.9) {
      scope.mapContainer.scale.x += 0.1;
      scope.mapContainer.scale.y += 0.1;
      scope.mapRoomsGfx.scale.x += 0.1;
      scope.mapRoomsGfx.scale.y += 0.1;
      scope.objectsContainer.scale.x += 0.1;
      scope.objectsContainer.scale.y += 0.1;
      scope.mapSelectionGfx.scale.x += 0.1;
      scope.mapSelectionGfx.scale.y += 0.1;
    } else if (scope.mapContainer.scale.x > 0.3) {
      scope.mapContainer.scale.x -= 0.1;
      scope.mapContainer.scale.y -= 0.1;
      scope.mapRoomsGfx.scale.x -= 0.1;
      scope.mapRoomsGfx.scale.y -= 0.1;
      scope.objectsContainer.scale.x -= 0.1;
      scope.objectsContainer.scale.y -= 0.1;
      scope.mapSelectionGfx.scale.x -= 0.1;
      scope.mapSelectionGfx.scale.y -= 0.1;
    }
  });
}

MZ.Display.prototype.moveMap = function(change) {
  this.mapContainer.position.x += change.x;
  this.mapContainer.position.y += change.y;
  this.mapRoomsGfx.position.x += change.x;
  this.mapRoomsGfx.position.y += change.y;
  this.objectsContainer.position.x += change.x;
  this.objectsContainer.position.y += change.y;
  this.mapSelectionGfx.position.x += change.x;
  this.mapSelectionGfx.position.y += change.y;
}

MZ.Display.prototype.drawMap = function() {
  var startX = x = -1 * mz.game.map.fieldAmount.x * mz.game.map.fieldSize.width / 2,
      x = startX, startY = -1 * mz.game.map.fieldAmount.y * mz.game.map.fieldSize.height / 2,
      y = startY, fieldHandle = null;

  this.mapRoomsGfx.clear();
  for (var fY = 0; fY < mz.game.map.fieldAmount.y; fY++) {
    x = startX;
    for (var fX = 0; fX < mz.game.map.fieldAmount.x; fX++) {
      if (mz.game.map.loadedFields[fY][fX].visible == false) {
        // add map field
        fieldHandle = mz.game.map.fieldTypes[mz.game.map.loadedFields[fY][fX].type].handle;
        var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png"));
        sprite.position = { x: x, y: y };
        this.mapContainer.addChild(sprite);

        mz.game.map.loadedFields[fY][fX].visible = true;
        mz.game.map.loadedFields[fY][fX].sprite = sprite;

      } else {
        // update map field
        var fieldHandle = mz.game.map.fieldTypes[mz.game.map.loadedFields[fY][fX].type].handle;
        mz.game.map.loadedFields[fY][fX].sprite.setTexture(
          new PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png")
        );
      }
      if (mz.game.map.loadedFields[fY][fX].construction == 1) {
        mz.game.map.loadedFields[fY][fX].sprite.alpha = 0.5;
        mz.game.dispatchEvent(
          { type: 'display-map-construction', content: { fieldPosition: { x: fX, y: fY } } }
        );
      }

      if (mz.game.map.loadedFields[fY][fX].roomType > 0) {
        this.mapRoomsGfx.beginFill(mz.game.rooms.types[mz.game.map.loadedFields[fY][fX].roomType].color);
        this.mapRoomsGfx.drawRect(x, y, mz.game.map.fieldSize.width, mz.game.map.fieldSize.height);
        this.mapRoomsGfx.endFill();
      }
      x += mz.game.map.fieldSize.width;
    }
    y += mz.game.map.fieldSize.height;
  }

  if (this.mapInteractionSprite === null) {
    this.mapInteractionSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/blank.png"));
    this.mapInteractionSprite.position = { x: startX, y: startY };
    this.mapInteractionSprite.width = mz.game.map.fieldSize.width * mz.game.map.fieldAmount.x;
    this.mapInteractionSprite.height = mz.game.map.fieldSize.width * mz.game.map.fieldAmount.x;
    this.mapContainer.addChild(this.mapInteractionSprite);

    this.mapInteractionSprite.setInteractive(true);
    this.mapInteractionSprite.mousedown = function(mouse) {
      mz.game.dispatchEvent( { type: 'display-map-mousedown', content: { mouse: mouse } } );
    };
    this.mapInteractionSprite.mouseup = function(mouse) {
      mz.game.dispatchEvent( { type: 'display-map-mouseup', content: { mouse: mouse } } );
    };
  }
}

MZ.Display.prototype.drawSelection = function(mode, position, width, height) {
  if (mode != "start") this.mapSelectionGfx.clear();
  this.mapSelectionGfx.lineStyle(2 * Math.min(this.mapContainer.scale.x, this.mapContainer.scale.y), 0xFFDD3F);
  this.mapSelectionGfx.drawRect(position.x, position.y, width, height);
}

MZ.Display.prototype.removeSelection = function() {
  this.mapSelectionGfx.clear();
}

MZ.Display.prototype.drawObject = function(object) {
  var objectHandle = mz.game.objects.types[object.type].handle;
  var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/obj_"+objectHandle+".png"));
  sprite.anchor = {x: 0.5, y: 0.5};
  sprite.position = {
    x: object.position.x * mz.game.map.fieldSize.width + mz.game.map.fieldSize.width/2
       - mz.game.map.fieldAmount.x / 2 * mz.game.map.fieldSize.width,
    y: object.position.y * mz.game.map.fieldSize.height + mz.game.map.fieldSize.width/2
       - mz.game.map.fieldAmount.y / 2 * mz.game.map.fieldSize.height
  };
  this.objectsContainer.addChild(sprite);
  object.sprite = sprite;
}

MZ.Display.prototype.moveObject = function(object) {
  if (object.tasks.currentTask !== null && typeof object.tasks.list[object.tasks.currentTask] != "undefined") {
    var task = object.tasks.list[object.tasks.currentTask];
    task.path = mz.game.map.calculatePath(object.position, task.targetPosition);
    console.log(task.path);

    var tweens = [], scope = this,
        lastX = object.sprite.position.x, lastY = object.sprite.position.y;
    for (var i = 0; i < task.path.length; i++) {
      var nextX = task.path[i].x * mz.game.map.fieldSize.width + mz.game.map.fieldSize.width/2
                  - mz.game.map.fieldAmount.x / 2 * mz.game.map.fieldSize.width,
          nextY = task.path[i].y * mz.game.map.fieldSize.height + mz.game.map.fieldSize.width/2
                  - mz.game.map.fieldAmount.y / 2 * mz.game.map.fieldSize.height;

      tweens[i] = function(iI, iLastX, iLastY, iNextX, iNextY, iNextFieldX, iNextFieldY) {
        return new TWEEN.Tween( { x: iLastX, y: iLastY } )
          .to(
            { x: iNextX, y: iNextY }, 1000 * 100 / mz.game.objects.types[object.type].speed
          )
          .onUpdate( function () {
            object.sprite.position.x = this.x;
            object.sprite.position.y = this.y;
          })
          .onComplete( function () {
            object.position.x = iNextFieldX;
            object.position.y = iNextFieldY;
          });
      }(
        i, lastX, lastY, nextX, nextY, task.path[i].x, task.path[i].y
      );
      if (i > 0) {
        tweens[i-1].chain(tweens[i]);
      }
      lastX = nextX;
      lastY = nextY;
    }
    if (task.path.length > 0) {
      tweens[0].start();
    }
  }
}