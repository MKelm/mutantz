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
    tx.executeSql('CREATE TABLE IF NOT EXISTS ranglist (time unique, points)');
  });
  this.db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS grid (id unique, levelId, fieldx, fieldy, type)');
  });
  this.db.transaction(function (tx) {
    //tx.executeSql('DELETE FROM grid');
  });
}

MZ.Storage.prototype.constructor = MZ.Storage;

MZ.Storage.prototype.setTimePoints = function(points) {
  var time = mz.util.time();
  this.db.transaction(function (tx) {
    tx.executeSql('INSERT INTO ranglist (time, points) VALUES (?, ?)', [time, points]);
  });
}

MZ.Storage.prototype.loadRanglist = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM ranglist ORDER BY points DESC LIMIT 5', [], function (tx, results) {
      var ranglist = [];
      for (var i = 0; i < results.rows.length; i++) {
        ranglist.push(results.rows.item(i));
      }
      if (callback) callback.call(this, ranglist);
    });
  }, function() { if (callback) callback.call(this, []) });
}

MZ.Storage.prototype.setGridField = function(id, levelId, fieldX, fieldY, type) {
  var scope = this;
  this.db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO map (id, levelId, fieldx, fieldy, type) VALUES (?, ?, ?, ?, ?)',
      [id, levelId, fieldX, fieldY, type],
      function() {},
      function() {
        scope.db.transaction(function (tx) {
          tx.executeSql(
            'UPDATE map SET type=?, WHERE id=?', [type],
            function(tx) { }, function(tx, error) { }
          );
        });
      }
    );
  });
}

MZ.Storage.prototype.loadGridFields = function(callback) {
  this.db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM grid ORDER BY id ASC', [], function (tx, results) {
      var gridFields = [];
      for (var i = 0; i < results.rows.length; i++) {
        gridFields.push(results.rows.item(i));
      }
      if (callback) callback.call(this, gridFields);
    });
  }, function() { if (callback) callback.call(this, []) });
}