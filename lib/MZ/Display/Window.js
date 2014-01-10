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

MZ.DisplayWindow = function(width, height) {
  MZ.DisplayPanel.call(this, width, height);

  this.title = "";
}

MZ.DisplayWindow.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayWindow.prototype.constructor = MZ.DisplayWindow;

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
      mz.game.dispatchEvent({
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
      mz.util.isoDateTime(ranglist[i].time) + ", " + ranglist[i].points + " points";
    var tListItem = new PIXI.Text(text, style);
    tListItem.position = { x: this.width/2-tListItem.width/2, y: posY };
    this.container.addChild(tListItem);
    posY += tListItem.height + 10;
  }
}