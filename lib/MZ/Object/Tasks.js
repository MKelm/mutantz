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

MZ.ObjectTasks = function() {

  this.currentTaskId = null;
  this.list = [];
}

MZ.ObjectTasks.prototype.constructor = MZ.ObjectTasks;

MZ.ObjectTasks.prototype.setTask = function(handle, targetPosition) {
  this.list.push({ handle: handle, targetPosition: targetPosition, path: null });
  if (this.currentTaskId === null) {
    this.currentTaskId = this.list.length-1;
    return 2; // added & selected
  }
  return 1; // added
}

MZ.ObjectTasks.prototype.setNextTask = function() {
  this.list.splice(this.currentTaskId, 1);
  if (this.list.length > 0) {
    this.currentTaskId = 0;
    return true;
  }
  this.currentTaskId = null;
  return false;
}