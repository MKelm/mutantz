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

MZ.Enemies = function() {

  this.types = [
    { handle: "none", title: "None", damage: -1 },
    { handle: "bug", title: "Bug", damage: 1.5 },
    { handle: "nux", title: "Nux", damage: 3.0 }
  ];
  this.selectedEnemyTypeId = -1;

  this.list = [];
}

MZ.Enemies.prototype.constructor = MZ.Enemies;

MZ.Enemies.prototype.setList = function(list) {
  if (typeof list != "undefined") this.list = list;
}

MZ.Enemies.prototype.getList = function(withoutSprite) {
  if (!withoutSprite) return this.list;
  var list = [];
  for (var i = 0; i < this.list.length; i++) {
    list[i] = { type: this.list[i].type, position: this.list[i].position, sprite: null };
  }
  return list;
}

MZ.Enemies.prototype.addEnemy = function(type, fieldX, fieldY) {
  this.list.push( { type: type, position: { x: fieldX, y: fieldY }, sprite: null } );
}

MZ.Enemies.prototype.removeEnemy = function(fieldX, fieldY) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].position.x == fieldX && this.list[i].position.y == fieldY) {
      mz.game.display.removeEnemy(this.list[i]);
      this.list.splice(i, 1);
    }
  }
}