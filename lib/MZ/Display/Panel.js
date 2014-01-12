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

MZ.DisplayPanel = function(width, height) {
  this.handle = "default";

  this.width = width;
  this.height = height;

  this.container = null;
  this.visible = false;
}

MZ.DisplayPanel.prototype.constructor = MZ.DisplayPanel;

MZ.DisplayPanel.prototype.initialize = function(position) {
  if (typeof position == "undefined") position = { x: -1 * this.width/2, y: -1 * this.height/2 };
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: position.x, y: position.y };
  mz.game.display.container.addChild(this.container);
}

MZ.DisplayPanel.prototype.show = function() {
  this.visible = true;
  this.initialize();
  this.drawContent();
}

MZ.DisplayPanel.prototype.hide = function() {
  this.visible = false;
  if (mz.game.display.container.children.indexOf(this.container) !== -1)
    mz.game.display.container.removeChild(this.container);
}

MZ.DisplayPanel.prototype.drawContent = function() {
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x4B4B4B);
  gfx.alpha = 0.7;
  gfx.drawRect(0, 0, this.width, this.height);
  gfx.endFill();
  this.container.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1.5, 0xFFFFFF);
  gfx.drawRect(0, 0, this.width, this.height);
  this.container.addChild(gfx);
}