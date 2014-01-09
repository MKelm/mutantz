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

// wrapper class for pixi stuff

MZ.Pixi = function() {
  this.screen = { width: 800, height: 600, ratio: 0 };

  // create an new instance of a pixi stage
  this.stage = new PIXI.Stage(0x424242, true); // interactive

  // create a renderer instance.
  this.renderer = PIXI.autoDetectRenderer(
    this.screen.width, this.screen.height, null, true // transparency
  );
  this.autoResizeRenderer();

  this.setFpsCounter();

  var scope = this;
  $(window).resize(function() {
    scope.autoResizeRenderer();
  });

  this.resizeCallback = null;

  var loader = [false, {}];
}

MZ.Pixi.prototype.constructor = MZ.Pixi;

MZ.Pixi.prototype.autoResizeRenderer = function() {
  if (this.screen.ratio !== 0) {
    // restore default screen size for new resize action
    this.screen.width = this.screen.baseSize.width;
    this.screen.height = this.screen.baseSize.height;
  } else {
    this.screen.baseSize = { width: this.screen.width, height: this.screen.height };
  }
  // resize display size by current window size
  this.screen.ratio = Math.min(
    window.innerWidth / this.screen.width, window.innerHeight / this.screen.height
  );
  this.screen.width = this.screen.width * this.screen.ratio;
  this.screen.height = this.screen.height * this.screen.ratio;
  this.renderer.resize(this.screen.width, this.screen.height);
  $("body").css("font-size", (2 * this.screen.ratio) + "em");

  if (window.innerWidth > this.screen.width) {
    $("body").css(
      "padding-left", Math.floor((window.innerWidth - this.screen.width) / 2)+"px"
    );
  }
  if (typeof this.resizeCallback != "undefined" && this.resizeCallback !== null) {
    this.resizeCallback.call(this);
  }
}

// needs a valid scope to get the active pixi instance!
MZ.Pixi.prototype.animate = function(scope) {
  // optional fpc counter
  if (scope.fps[0] > -1) {
    scope.fps[0]++;
  }

  if (mz.game.run == true) {
    mz.game.update(mz.game);
  }
  scope.renderer.render(scope.stage);
  TWEEN.update();

  if (mz.userConfig.fps > -1) {
    global.setTimeout(function() { requestAnimFrame(scope.animate.curry(scope)); }, 1000 / mz.userConfig.fps );
  } else {
    requestAnimFrame(scope.animate.curry(scope));
  }
}

MZ.Pixi.prototype.setLoader = function(activate) {
  if (activate === true) {
    var style = {font: Math.floor(40 * this.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
    var loaderText = new PIXI.Text("Loading ...", style);
    loaderText.anchor = { x: 0.5, y: 0.5 };
    loaderText.position.x = this.screen.width / 2;
    loaderText.position.y = this.screen.height / 2;
    this.stage.addChild(loaderText);
    this.loader = [true, loaderText];
  } else if (activate === false) {
    this.stage.removeChild(this.loader[1]);
    this.loader = [false, {}];
  }
}

MZ.Pixi.prototype.loadAssets = function(callback) {
  this.setLoader(true);
  var assetsToLoad = [ "data/gfx/blank.png", "data/gfx/blank_dbg.png" ];
  loader = new PIXI.AssetLoader(assetsToLoad);
  var scope = this;
  loader.onComplete = function() { scope.setLoader(false); callback.call(); };
  loader.load();
}

MZ.Pixi.prototype.setFpsCounter = function(keyEvent, scope) {
  if (typeof keyEvent == "undefined") {
    scope = this;
  }
  if (typeof scope.fps == "undefined") {
    style = {font: Math.floor(15 * scope.screen.ratio) + "px " + "Arial", fill: "FFFFFF"};
    scope.fps = [-1, new PIXI.Text("0", style)]; // fps[0] = -1 => disabled counter
    scope.fps[1].position.x = 5 * scope.screen.ratio;
    scope.fps[1].position.y = 5 * scope.screen.ratio;
    scope.fps[1].visible = false;
  } else {
    if (keyEvent === true && scope.fps[0] < 0) {
      scope.fps[0] = 0;
      scope.fps[1].visible = true;
      mz.intervals["fpsCounter"] = setInterval(scope.setFpsCounter.curry(false, scope), 1000);
      keyEvent = false;
      scope.stage.addChild(scope.fps[1]);
    }
    scope.fps[1].setText(scope.fps[0] < 0 ? 0 : scope.fps[0]);
    scope.fps[0] = 0;
    if (keyEvent === true && scope.fps[0] > -1) {
      clearInterval(mz.intervals["fpsCounter"]);
      scope.fps[1].visible = false;
      scope.fps[0] = -1;
      scope.stage.removeChild(scope.fps[1]);
    }
  }
}
