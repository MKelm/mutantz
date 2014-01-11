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

// storage class to perform database actions

MZ.Storage = function() {
  this.db = openDatabase('mzdb1', '1.0', 'mzdb1', 2 * 1024 * 1024);

  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ranglist (time unique, money)');
  });
  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS map (id unique, fieldx, fieldy, type, roomType, construction)');
  });
  this.db.transaction(function (tx) {
    //tx.executeSql('DELETE FROM map');
  });
}

MZ.Storage.prototype.constructor = MZ.Storage;

MZ.Storage.prototype.setTimePoints = function(points) {
  var time = mz.util.time();
  this.db.transaction(function (tx) {
    tx.executeSql('INSERT INTO ranglist (time, money) VALUES (?, ?)', [time, points]);
  });
}

MZ.Storage.prototype.loadRanglist = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM ranglist ORDER BY money DESC LIMIT 5', [], function (tx, results) {
      var ranglist = [];
      for (var i = 0; i < results.rows.length; i++) {
        ranglist.push(results.rows.item(i));
      }
      if (callback) callback.call(this, ranglist);
    });
  }, function() { if (callback) callback.call(this, []) });
}

MZ.Storage.prototype.setMapField = function(id, fieldX, fieldY, type, roomType, construction) {
  var scope = this;
  this.db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO map (id, fieldx, fieldy, type, roomType, construction) VALUES (?, ?, ?, ?, ?, ?)',
      [id, fieldX, fieldY, type, roomType, construction],
      function() {},
      function() {
        scope.db.transaction(function (tx) {
          tx.executeSql(
            'UPDATE map SET type=?, roomType=?, construction=? WHERE id=?', [type, roomType, construction, id],
            function(tx) { }, function(tx, error) { }
          );
        });
      }
    );
  });
}

MZ.Storage.prototype.loadMapFields = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM map ORDER BY id ASC', [], function (tx, results) {
      var mapFields = [];
      for (var i = 0; i < results.rows.length; i++) {
        mapFields.push(results.rows.item(i));
      }
      if (callback) callback.call(this, mapFields);
    });
  }, function() { if (callback) callback.call(this, []) });
}