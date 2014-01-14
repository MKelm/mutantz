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

MZ.DisplayPanelAreas = function() {
  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "areas";
  this.areaTypeSelection = { id: -1, gfx: null };

  this.areaItemSize = { width: 100, height: 100 };
}

MZ.DisplayPanelAreas.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelAreas.prototype.constructor = MZ.DisplayPanelAreas;

MZ.DisplayPanelAreas.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 260 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelAreas.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawAreas();
}

MZ.DisplayPanelAreas.prototype.hide = function() {
  MZ.DisplayPanel.prototype.hide.call(this);
  this.areaTypeSelection.id = -1;
  this.areaTypeSelection.gfx = null;
}

MZ.DisplayPanelAreas.prototype.drawAreaSelection = function(x, y) {
  if (this.areaTypeSelection.id > -1) {
    if (this.container.children.indexOf(this.areaTypeSelection.gfx) === -1) {
      this.areaTypeSelection.gfx = new PIXI.Graphics();
      this.container.addChild(this.areaTypeSelection.gfx);
    } else {
      this.areaTypeSelection.gfx.clear();
    }

    this.areaTypeSelection.gfx.lineStyle(2, 0xFFDD3F);
    this.areaTypeSelection.gfx.drawRect(x, y, this.areaItemSize.width, this.areaItemSize.height);
  }
}

MZ.DisplayPanelAreas.prototype.drawAreas = function() {
  var x = 10; y = 10, scope = this, gfx = new PIXI.Graphics(), grid = mz.game.grid;
  gfx.alpha = 0.5;
  this.container.addChild(gfx);
  for (var i = 0; i < grid.areaTypes.length; i++) {
    var areaType = grid.areaTypes[i];
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/blank.png"));
    sprite.position = { x: x, y: y };
    sprite.width = this.areaItemSize.width;
    sprite.height = this.areaItemSize.height;

    sprite.setInteractive(true);
    !function(areaTypeId, posX, posY) {
      sprite.click = function(mouse) {
        mz.game.dispatchEvent({
          type: "panel-area-click", content: { areaTypeId: areaTypeId }
        });
        scope.areaTypeSelection.id = areaTypeId;
        scope.drawAreaSelection(posX, posY);
      };
    }(i, x, y);
    this.container.addChild(sprite);

    if (i > 0) {
      gfx.beginFill(areaType.color);
      gfx.drawRect(x, y, this.areaItemSize.width, this.areaItemSize.height);
      gfx.endFill();
    }

    var style = { font: 24 + "px " + "Arial", fill: "FFFFFF" };
    style.wordWrapWidth = this.areaItemSize.width;
    style.wordWrap = true;
    var tText = new PIXI.Text(areaType.title, style);
    tText.position = {
      x: x + this.areaItemSize.width/2-tText.width/2,
      y: y + this.areaItemSize.height/2-tText.height/2,
    };
    this.container.addChild(tText);

    if (i == this.areaTypeSelection.id) scope.drawAreaSelection(x, y);

    x += this.areaItemSize.width + 10;
  }
}