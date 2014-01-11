/*
 * This file is part of NuaoX.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/nuaox
 *
 * NuaoX is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * NuaoX is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with NuaoX. If not, see <http://www.gnu.org/licenses/>.
 */

MZ.DisplayPanelRooms = function() {
  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "rooms";
  this.roomTypeSelection = { id: -1, gfx: null };

  this.roomItemSize = { width: 100, height: 100 };
}

MZ.DisplayPanelRooms.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelRooms.prototype.constructor = MZ.DisplayPanelRooms;

MZ.DisplayPanelRooms.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 260 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelRooms.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawRooms();
}

MZ.DisplayPanelRooms.prototype.drawRoomSelection = function(x, y) {
  if (this.roomTypeSelection.id > -1) {
    if (this.container.children.indexOf(this.roomTypeSelection.gfx) === -1) {
      this.roomTypeSelection.gfx = new PIXI.Graphics();
      this.container.addChild(this.roomTypeSelection.gfx);
    } else {
      this.roomTypeSelection.gfx.clear();
    }

    this.roomTypeSelection.gfx.lineStyle(2, 0xFFDD3F);
    this.roomTypeSelection.gfx.drawRect(x, y, this.roomItemSize.width, this.roomItemSize.height);
  }
}

MZ.DisplayPanelRooms.prototype.drawRooms = function() {
  var x = 10; y = 10, scope = this, gfx = new PIXI.Graphics();
  gfx.alpha = 0.5;
  this.container.addChild(gfx);
  for (var i = 0; i < mz.game.rooms.types.length; i++) {
    var roomType = mz.game.rooms.types[i];
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/blank.png"));
    sprite.position = { x: x, y: y };
    sprite.width = this.roomItemSize.width;
    sprite.height = this.roomItemSize.height;

    sprite.setInteractive(true);
    !function(roomTypeId, posX, posY) {
      sprite.click = function(mouse) {
        mz.game.dispatchEvent({
          type: "panel-room-click", content: { roomTypeId: roomTypeId }
        });
        scope.roomTypeSelection.id = roomTypeId;
        scope.drawRoomSelection(posX, posY);
      };
    }(i, x, y);
    this.container.addChild(sprite);

    if (i > 0) {
      gfx.beginFill(roomType.color);
      gfx.drawRect(x, y, this.roomItemSize.width, this.roomItemSize.height);
      gfx.endFill();
    }

    var style = { font: 24 + "px " + "Arial", fill: "FFFFFF" };
    style.wordWrapWidth = this.roomItemSize.width;
    style.wordWrap = true;
    var tText = new PIXI.Text(roomType.title, style);
    tText.position = {
      x: x + this.roomItemSize.width/2-tText.width/2,
      y: y + this.roomItemSize.height/2-tText.height/2,
    };
    this.container.addChild(tText);

    if (i == this.roomTypeSelection.id) scope.drawRoomSelection(x, y);

    x += this.roomItemSize.width + 10;
  }
}