this['/beget/test/Beget'] = {
  setUp: function () {
    this.assert = require('assert');
    this._ = require('underscore');
  },

  beforeEach: function () {
    this.Beget = require('beget')['/Beget'];
  },

  '#_extractNSPieces()': {
    'should return a map containing exportType, target, method, keys and path': function () {
      var pieces = this.Beget._extractNSPieces('/Cat');
      this.assert.deepEqual(['exportType', 'target', 'method', 'keys', 'path'], this._(pieces).keys());
    },

    'exportType': {
      'should be slash when ns prefixed with slash': function () {
        var pieces = this.Beget._extractNSPieces('/Cat');
        this.assert.equal('/', pieces.exportType);
      },

      'should be a right chevron when ns prefixed with right chevron': function () {
        var pieces = this.Beget._extractNSPieces('>cat');
        this.assert.equal('>', pieces.exportType);
      },

      'should be a pound-slash when ns prefixed with pound-slash': function () {
        var pieces = this.Beget._extractNSPieces('#/Cat');
        this.assert.equal('#/', pieces.exportType);
      }
    },

    'method': {
      'should be characters proceeding pound when pound not first character': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face#meow');
        this.assert.equal('meow', pieces.method);
      },

      'should be characters proceeding pound when pound also first character': function () {
        var pieces = this.Beget._extractNSPieces('#/Cat/Face#meow');
        this.assert.equal('meow', pieces.method);
      },

      'should be null when pound only first character': function () {
        var pieces = this.Beget._extractNSPieces('#/Cat');
        this.assert.equal(null, pieces.method);
      },

      'should be null when pound absent': function () {
        var pieces = this.Beget._extractNSPieces('/Cat');
        this.assert.equal(null, pieces.method);
      }
    },

    'path': {
      'should be list when path exists': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face');
        this.assert(pieces.path instanceof [].constructor);
      },

      'should be null when path absent': function () {
        var pieces = this.Beget._extractNSPieces('>backbone.View');
        this.assert.equal(null, pieces.path);
      },

      'should still be list of all levels within path': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face/Whiskers');
        this.assert.deepEqual(['Cat', 'Face', 'Whiskers'], pieces.path);
      },

      'should still be list even when path is single level': function () {
        var pieces = this.Beget._extractNSPieces('/Cat');
        this.assert.deepEqual(['Cat'], pieces.path);
      }
    },

    'keys': {
      'should be list when keys exist': function () {
        var pieces = this.Beget._extractNSPieces('/Cat.whiskers.count');
        this.assert(pieces.keys instanceof [].constructor);
      },

      'should be null keys absent': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face/Whiskers');
        this.assert.equal(null, pieces.keys);
      },

      'should be list of all levels within key nesting': function () {
        var pieces = this.Beget._extractNSPieces('/Cat.left.count.toString');
        this.assert.deepEqual(['left', 'count', 'toString'], pieces.keys);
      },

      'should be list even when single level of keys': function () {
        var pieces = this.Beget._extractNSPieces('/Cat.left');
        this.assert.deepEqual(['left'], pieces.keys);
      },

      'should not include method on deepest key': function () {
        var pieces = this.Beget._extractNSPieces('>backbone.View#extend');
        this.assert.deepEqual(['View'], pieces.keys);
      }
    },

    'target': {
      'should be string when path absent': function () {
        var pieces = this.Beget._extractNSPieces('>backbone.View');
        this.assert(pieces.target.constructor === ''.constructor);
      },

      'should be string when keys absent': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face');
        this.assert(pieces.target.constructor === ''.constructor);
      },

      'should be class in path when keys absent': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face');
        this.assert.equal('Face', pieces.target);
      },

      'should be something when path and keys absent': function () {
        var pieces = this.Beget._extractNSPieces('>cat');
        this.assert.equal('cat', pieces.target);
      },

      'should be deepest key when keys exist': function () {
        var pieces = this.Beget._extractNSPieces('>backbone.View.extend');
        this.assert.equal('extend', pieces.target);
      },

      'should be deepest key when keys and path exist': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face/Whiskers.count.toString');
        this.assert.equal('toString', pieces.target);
      },

      'should be deepest key when method and keys exists': function () {
        var pieces = this.Beget._extractNSPieces('/backbone.View#extend');
        this.assert.equal('View', pieces.target);
      },

      'should be class in path when method exists and keys absent': function () {
        var pieces = this.Beget._extractNSPieces('/Cat/Face#getWhiskers');
        this.assert.equal('Face', pieces.target);
      }
    }
  }
};
