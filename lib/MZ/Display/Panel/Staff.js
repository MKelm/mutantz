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

MZ.DisplayPanelStaff = function() {
  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "staff";
  this.staffTypeSelection = { id: -1, gfx: null };

  this.staffObjectSize = { width: 100, height: 100 };
}

MZ.DisplayPanelStaff.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelStaff.prototype.constructor = MZ.DisplayPanelStaff;

MZ.DisplayPanelStaff.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 260 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelStaff.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawStaffObjects();
}

MZ.DisplayPanelStaff.prototype.drawStaffSelection = function(x, y) {
  if (this.staffTypeSelection.id > -1) {
    if (this.container.children.indexOf(this.staffTypeSelection.gfx) === -1) {
      this.staffTypeSelection.gfx = new PIXI.Graphics();
      this.container.addChild(this.staffTypeSelection.gfx);
    } else {
      this.staffTypeSelection.gfx.clear();
    }

    this.staffTypeSelection.gfx.lineStyle(2, 0xFFDD3F);
    this.staffTypeSelection.gfx.drawRect(x, y, this.staffObjectSize.width, this.staffObjectSize.height);
  }
}

MZ.DisplayPanelStaff.prototype.drawStaffObjects = function() {
  var x = 10; y = 10, scope = this, gfx = new PIXI.Graphics();
  gfx.alpha = 0.5;
  this.container.addChild(gfx);
  for (var i = 0; i < mz.game.objects.types.length; i++) {
    var objectType = mz.game.objects.types[i];
    if (objectType.staff == true) {

      var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/obj_"+objectType.handle+".png"));
      sprite.position = { x: x, y: y };

      sprite.setInteractive(true);
      !function(staffTypeId, posX, posY) {
        sprite.click = function(mouse) {
          mz.game.dispatchEvent({
            type: "panel-staff-click", content: { staffTypeId: staffTypeId }
          });
          scope.staffTypeSelection.id = staffTypeId;
          scope.drawStaffSelection(posX, posY);
        };
      }(i, x, y);
      this.container.addChild(sprite);

      var style = { font: 24 + "px " + "Arial", fill: "FFFFFF" };
      style.wordWrapWidth = this.staffObjectSize.width;
      style.wordWrap = true;
      var tText = new PIXI.Text(objectType.title, style);
      tText.position = {
        x: x + this.staffObjectSize.width/2-tText.width/2,
        y: y + this.staffObjectSize.height/2-tText.height/2,
      };
      this.container.addChild(tText);

      if (i == this.staffTypeSelection.id) scope.drawStaffSelection(x, y);

      x += this.staffObjectSize.width + 10;
    }
  }
}