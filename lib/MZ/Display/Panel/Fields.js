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

MZ.DisplayPanelFields = function() {
  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "fields";
  this.fieldSize = { width: 100, height: 100 };
  this.fieldTypeSelection = { id: -1, gfx: null };

}

MZ.DisplayPanelFields.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelFields.prototype.constructor = MZ.DisplayPanelFields;

MZ.DisplayPanelFields.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 260 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelFields.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawFields();
}

MZ.DisplayPanelFields.prototype.hide = function() {
  MZ.DisplayPanel.prototype.hide.call(this);
  this.fieldTypeSelection.id = -1;
  this.fieldTypeSelection.gfx = null;
}

MZ.DisplayPanelFields.prototype.drawFieldSelection = function(x, y) {
  if (this.fieldTypeSelection.id > -1) {
    if (this.container.children.indexOf(this.fieldTypeSelection.gfx) === -1) {
      this.fieldTypeSelection.gfx = new PIXI.Graphics();
      this.container.addChild(this.fieldTypeSelection.gfx);
    } else {
      this.fieldTypeSelection.gfx.clear();
    }

    this.fieldTypeSelection.gfx.lineStyle(2, 0xFFDD3F);
    this.fieldTypeSelection.gfx.drawRect(
      x, y, this.fieldSize.width, this.fieldSize.height
    );
  }
}

MZ.DisplayPanelFields.prototype.drawFields = function() {
  var x = 10; y = 10, scope = this, grid = mz.game.grid;
  for (var i = 0; i < grid.fieldTypes.length; i++) {
    var fieldType = grid.fieldTypes[i];
    var fieldHandle = (fieldType.handle == "space") ? "space_editor" : fieldType.handle;
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/field_"+fieldHandle+".png"));
    sprite.position = { x: x, y: y };

    sprite.setInteractive(true);
    !function(fieldTypeId, posX, posY) {
      sprite.click = function(mouse) {
        mz.game.dispatchEvent({
          type: "panel-field-click", content: { fieldTypeId: fieldTypeId }
        });
        scope.fieldTypeSelection.id = fieldTypeId;
        scope.drawFieldSelection(posX, posY);
      };
    }(i, x, y);
    this.container.addChild(sprite);

    var style = { font: 26 + "px " + "Arial", fill: "FFFFFF" };
    var tText = new PIXI.Text(fieldType.title, style);
    tText.position = {
      x: x + this.fieldSize.width/2-tText.width/2,
      y: y + this.fieldSize.height/2-tText.height/2,
    };
    this.container.addChild(tText);

    if (i == this.fieldTypeSelection.id) scope.drawFieldSelection(x, y);

    x += this.fieldSize.width + 10;
  }
}