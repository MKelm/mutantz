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

MZ.Objects = function() {

  this.types = [
    { handle: "helper", title: "Helper", type: "char" }, // 0
    { handle: "transportship", title: "Transport ship", type: "ship" } // 1
  ];

  this.list = [];
}

MZ.Objects.prototype.constructor = MZ.Objects;

MZ.Objects.prototype.setObject = function(type, position, sprite) {
  this.list.push({ type: type, position: position, sprite: sprite, tasks: new MZ.ObjectTasks() });
  return this.list.length - 1;
}

MZ.Objects.prototype.removeObject = function(i) {
  if (typeof this.list[i] != "undefined" && this.list[i] !== null) {
    this.list[i] = null;
    return true;
  }
  return false;
}

MZ.Objects.prototype.removeObjectByPosition = function(position) {
  for (var i = 0; i < this.list.length; i++) {
    if (this.list[i].position.x == position.x && this.list[i].position.y == position.y) {
      return this.removeObject(i);
    }
  }
  return false;
}