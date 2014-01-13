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

MZ.Game = function() {
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);
  this.fps = -1;
  this.money = 0;

  this.run = false;
  this.lastUpdateTime = null;

  this.display = new MZ.Display(this);

  this.welcomeWindow = null, this.gameOverWindow = null;

  // register interaction event listeners
  this.addEventListener('something', mz.util.getEventListener(this, "handleEvent"));
}

MZ.Game.prototype.constructor = MZ.Game;

MZ.Game.prototype.start = function() {
  this.display.initialize();

  //this.showWelcomeWindow();
}

MZ.Game.prototype.showWelcomeWindow = function() {
  this.welcomeWindow = new MZ.DisplayWindow(550, 200)
  this.welcomeWindow.handle = "welcome";
  this.welcomeWindow.show();
  this.welcomeWindow.drawCloseButton();
  this.welcomeWindow.drawContentText(
    "Welcome to Mutantz ...",
    500,
    40
  );
}

MZ.Game.prototype.showGameOverWindow = function(ranglist) {
  this.gameOverWindow = new MZ.DisplayWindow(400, 290)
  this.gameOverWindow.handle = "gameover";
  this.gameOverWindow.title = "Game Over";
  this.gameOverWindow.show();
  this.gameOverWindow.drawTitle();
  this.gameOverWindow.drawContentText("Highscores:", false, 60);
  this.gameOverWindow.drawRanglist(ranglist, 105);
}

MZ.Game.prototype.update = function(scope) {
  var timeDiff = mz.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;

  if (scope.run == true) {
    for (var key in mz.keys) {
      if (key == 37 || key == 65) { // left
        // todo
      } else if (key == 39 || key == 68) { // right
        // todo
      } else if (key == 38 || key == 87) { // up
        // todo
      } else if (key == 40 || key == 83) { // down
        // todo
      }
    }
  }
  scope.lastUpdateTime = mz.util.time();
}

MZ.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "something":
      break;
  }
}