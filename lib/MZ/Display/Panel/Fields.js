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

MZ.DisplayPanelFields = function() {
  PIXI.EventTarget.call(this);

  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "fields";

  this.addEventListener('panel-field-click', mz.util.getEventListener(this, "handleEvent"));
}

MZ.DisplayPanelFields.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelFields.prototype.constructor = MZ.DisplayPanelFields;

MZ.DisplayPanelFields.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 160 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelFields.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawFields();
}

MZ.DisplayPanelFields.prototype.drawFields = function() {
  var x = 10; y = 10, scope = this;
  for (var i = 0; i < mz.game.map.fieldTypes.length; i++) {
    var fieldType = mz.game.map.fieldTypes[i];
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/field_"+fieldType.handle+".png"));
    sprite.position = { x: x, y: y };

    sprite.setInteractive(true);
    !function(fieldTypeId) {
      sprite.click = function(mouse) {
        scope.dispatchEvent({
          type: "panel-field-click", content: { fieldTypeId: fieldTypeId }
        });
      };
    }(i);
    this.container.addChild(sprite);

    var style = { font: 26 + "px " + "Arial", fill: "FFFFFF" };
    var tText = new PIXI.Text(fieldType.title, style);
    tText.position = {
      x: x + mz.game.map.fieldSize.width/2-tText.width/2,
      y: y + mz.game.map.fieldSize.height/2-tText.height/2,
    };
    this.container.addChild(tText);

    x += mz.game.map.fieldSize.width + 10;
  }
}

MZ.DisplayPanelFields.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "panel-field-click":
      console.log(event.content);
      break;
  }
}