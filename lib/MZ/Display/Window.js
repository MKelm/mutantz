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

MZ.DisplayWindow = function(width, height) {
  this.handle = "default";
  this.width = width;
  this.height = height;
  this.container = null;
  this.title = "";
  this.visible = false;
}

MZ.DisplayWindow.prototype.constructor = MZ.DisplayWindow;

MZ.DisplayWindow.prototype.initialize = function() {
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position = {x: -1 * this.width/2, y: -1 * this.height/2 };
  mz.game.display.container.addChild(this.container);
}

MZ.DisplayWindow.prototype.show = function() {
  this.visible = true;
  this.initialize();
  this.drawContent();
}

MZ.DisplayWindow.prototype.hide = function() {
  this.visible = false;
  this.game.display.container.removeChild(this.container);
}

MZ.DisplayWindow.prototype.drawContent = function() {
  var gfx = new PIXI.Graphics();
  gfx.beginFill(0x4B4B4B);
  gfx.alpha = 0.7;
  gfx.drawRect(0, 0, this.width, this.height);
  this.container.addChild(gfx);

  var gfx = new PIXI.Graphics();
  gfx.lineStyle(1.5, 0xFFFFFF);
  gfx.drawRect(0, 0, this.width, this.height);
  this.container.addChild(gfx);
}

MZ.DisplayWindow.prototype.drawTitle = function() {
  if (this.title.length > 0) {
    var style = {font: 36 + "px " + "Arial", fill: "FFFFFF"};
    var tTitle = new PIXI.Text(this.title, style);
    tTitle.position = { x: this.width/2-tTitle.width/2, y: 10 };
    this.container.addChild(tTitle);
  }
}

MZ.DisplayWindow.prototype.drawCloseButton = function() {
  var style = {font: 20 + "px " + "Arial", fill: "FFFFFF"}, sprite = null, scope = this;
  var tClose = new PIXI.Text("X", style);
  tClose.position = { x: this.width-tClose.width-10, y: 10 };
  this.container.addChild(tClose);

  sprite = new PIXI.Sprite(
    PIXI.Texture.fromFrame("data/gfx/blank.png")
  );
  sprite.width = tClose.width;
  sprite.height = tClose.height;
  sprite.position = { x: this.width-tClose.width-10, y: 10 };
  sprite.setInteractive(true);
  !function() {
    sprite.click = function(mouse) {
      scope.game.dispatchEvent({
        type: "window-close-click", content: { window: scope.handle }
      });
    };
  }();
  this.container.addChild(sprite);
}

MZ.DisplayWindow.prototype.drawContentText = function(text, wordWrapWidth, posY) {
  var style = { font: 26 + "px " + "Arial", fill: "FFFFFF" };
  if (wordWrapWidth > 0) {
    style.wordWrapWidth = wordWrapWidth;
    style.wordWrap = true;
  }
  var tText = new PIXI.Text(text, style);
  tText.position = { x: this.width/2-tText.width/2, y: posY || 60 };
  this.container.addChild(tText);
}

MZ.DisplayWindow.prototype.drawRanglist = function(ranglist, posY) {
  var style = {font: 20 + "px " + "Arial", fill: "FFFFFF"}, text = null;
  for (var i = 0; i < 5; i++) {
    text = (typeof ranglist[i] == "undefined") ? "--- empty ---" :
      nx.util.isoDateTime(ranglist[i].time) + ", " + ranglist[i].points + " points";
    var tListItem = new PIXI.Text(text, style);
    tListItem.position = { x: this.width/2-tListItem.width/2, y: posY };
    this.container.addChild(tListItem);
    posY += tListItem.height + 10;
  }
}