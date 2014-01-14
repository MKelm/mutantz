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

MZ.DisplayPanelEnemies = function() {
  MZ.DisplayPanel.call(this, 750, 120);
  this.handle = "enemies";
  this.enemyTypeSelection = { id: -1, gfx: null };

  this.enemyObjectSize = { width: 100, height: 100 };
}

MZ.DisplayPanelEnemies.prototype = Object.create(MZ.DisplayPanel.prototype);
MZ.DisplayPanelEnemies.prototype.constructor = MZ.DisplayPanelEnemies;

MZ.DisplayPanelEnemies.prototype.initialize = function() {
  var position = { x: -1 * 750/2, y: 260 };
  MZ.DisplayPanel.prototype.initialize.call(this, position);
}

MZ.DisplayPanelEnemies.prototype.show = function() {
  MZ.DisplayPanel.prototype.show.call(this);
  this.drawEnemyObjects();
}

MZ.DisplayPanelEnemies.prototype.hide = function() {
  MZ.DisplayPanel.prototype.hide.call(this);
  this.enemyTypeSelection.id = -1;
  this.enemyTypeSelection.gfx = null;
}

MZ.DisplayPanelEnemies.prototype.drawEnemySelection = function(x, y) {
  if (this.enemyTypeSelection.id > -1) {
    if (this.container.children.indexOf(this.enemyTypeSelection.gfx) === -1) {
      this.enemyTypeSelection.gfx = new PIXI.Graphics();
      this.container.addChild(this.enemyTypeSelection.gfx);
    } else {
      this.enemyTypeSelection.gfx.clear();
    }

    this.enemyTypeSelection.gfx.lineStyle(2, 0xFFDD3F);
    this.enemyTypeSelection.gfx.drawRect(x, y, this.enemyObjectSize.width, this.enemyObjectSize.height);
  }
}

MZ.DisplayPanelEnemies.prototype.drawEnemyObjects = function() {
  var x = 10; y = 10, scope = this, gfx = new PIXI.Graphics(), enemies = mz.game.enemies;
  gfx.alpha = 0.5;
  this.container.addChild(gfx);
  for (var i = 0; i < enemies.types.length; i++) {

    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame("data/gfx/enemy_"+enemies.types[i].handle+".png"));
    sprite.position = { x: x, y: y };
    sprite.width = this.enemyObjectSize.width;
    sprite.height = this.enemyObjectSize.height;

    sprite.setInteractive(true);
    !function(enemyTypeId, posX, posY) {
      sprite.click = function(mouse) {
        mz.game.dispatchEvent({
          type: "panel-enemy-click", content: { enemyTypeId: enemyTypeId }
        });
        scope.enemyTypeSelection.id = enemyTypeId;
        scope.drawEnemySelection(posX, posY);
      };
    }(i, x, y);
    this.container.addChild(sprite);

    var style = { font: 24 + "px " + "Arial", fill: "FFFFFF" };
    style.wordWrapWidth = this.enemyObjectSize.width;
    style.wordWrap = true;
    var tText = new PIXI.Text(enemies.types[i].title, style);
    tText.position = {
      x: x + this.enemyObjectSize.width/2-tText.width/2,
      y: y + this.enemyObjectSize.height/2-tText.height/2,
    };
    this.container.addChild(tText);

    if (i == this.enemyTypeSelection.id) scope.drawEnemySelection(x, y);

    x += this.enemyObjectSize.width + 10;
  }
}