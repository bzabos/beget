this['/beget/test/Beget'] = {
  setUp: function () {
    this.assert = require('assert');
    this._ = require('underscore');
  },

  beforeEach: function () {
    this.Beget = require('beget')['/Beget'];
  },

  // todo: we should add "pathId" prop to parsed (mitigate frequent path.join())
  '#_parseNamespace()': {
    'should return a map containing exportType, target, method, keys and path': function () {
      var pieces = this.Beget._parseNamespace('/Cat');
      this.assert.deepEqual(
        ["isLocal", "isModule", "isNamespaced", "method", "keys", "path", "target"],
        this._(pieces).keys());
    },

    'isLocal': {
      'should be true when prefixed with pound-slash': function () {
        var pieces = this.Beget._parseNamespace('#/Cat');
        this.assert(pieces.isLocal);
        this.assert(!pieces.isModule);
        this.assert(!pieces.isNamespaced);
      }
    },

    'isModule': {
      'should be true when prefixed with right chevron': function () {
        var pieces = this.Beget._parseNamespace('>backbone');
        this.assert(!pieces.isLocal);
        this.assert(pieces.isModule);
        this.assert(!pieces.isNamespaced);
      }
    },

    'isNamespaced': {
      'should be true when prefixed with slash': function () {
        var pieces = this.Beget._parseNamespace('/Cat');
        this.assert(!pieces.isLocal);
        this.assert(!pieces.isModule);
        this.assert(pieces.isNamespaced);
      }
    },

    'method': {
      'should be characters proceeding pound when pound not first character': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face#meow');
        this.assert.equal('meow', pieces.method);
      },

      'should be characters proceeding pound when pound also first character': function () {
        var pieces = this.Beget._parseNamespace('#/Cat/Face#meow');
        this.assert.equal('meow', pieces.method);
      },

      'should be null when pound only first character': function () {
        var pieces = this.Beget._parseNamespace('#/Cat');
        this.assert.equal(null, pieces.method);
      },

      'should be null when pound absent': function () {
        var pieces = this.Beget._parseNamespace('/Cat');
        this.assert.equal(null, pieces.method);
      }
    },

    'path': {
      'should be list when path exists': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face');
        this.assert(pieces.path instanceof [].constructor);
      },

      'should be first item when global': function () {
        var pieces = this.Beget._parseNamespace('>backbone.View');
        this.assert.equal('backbone', pieces.path);
      },

      'should still be list of all levels within path': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face/Whiskers');
        this.assert.deepEqual(['Cat', 'Face', 'Whiskers'], pieces.path);
      },

      'should still be list even when path is single level': function () {
        var pieces = this.Beget._parseNamespace('/Cat');
        this.assert.deepEqual(['Cat'], pieces.path);
      },

      'should contain base item in dot-notation when keys exist': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face/Whiskers.count.toString');
        this.assert.deepEqual(['Cat', 'Face', 'Whiskers'], pieces.path);
      }
    },

    'keys': {
      'should be list when keys exist': function () {
        var pieces = this.Beget._parseNamespace('/Cat.whiskers.count');
        this.assert(pieces.keys instanceof [].constructor);
      },

      'should be null keys absent': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face/Whiskers');
        this.assert.equal(null, pieces.keys);
      },

      'should be list of all levels within key nesting': function () {
        var pieces = this.Beget._parseNamespace('/Cat.left.count.toString');
        this.assert.deepEqual(['left', 'count', 'toString'], pieces.keys);
      },

      'should be list even when single level of keys': function () {
        var pieces = this.Beget._parseNamespace('/Cat.left');
        this.assert.deepEqual(['left'], pieces.keys);
      },

      'should not include method on deepest key': function () {
        var pieces = this.Beget._parseNamespace('>backbone.View#extend');
        this.assert.deepEqual(['View'], pieces.keys);
      }
    },

    'target': {
      'should be string when path absent': function () {
        var pieces = this.Beget._parseNamespace('>backbone.View');
        this.assert(pieces.target.constructor === ''.constructor);
      },

      'should be string when keys absent': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face');
        this.assert(pieces.target.constructor === ''.constructor);
      },

      'should be class in path when keys absent': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face');
        this.assert.equal('Face', pieces.target);
      },

      'should be module when path and keys absent': function () {
        var pieces = this.Beget._parseNamespace('>cat');
        this.assert.equal('cat', pieces.target);
      },

      'should be module without method when path and keys absent and method preset': function () {
        var pieces = this.Beget._parseNamespace('>cat#meow');
        this.assert.equal('cat', pieces.target);
      },

      'should be deepest key when keys exist': function () {
        var pieces = this.Beget._parseNamespace('>backbone.View.extend');
        this.assert.equal('extend', pieces.target);
      },

      'should be deepest key when keys and path exist': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face/Whiskers.count.toString');
        this.assert.equal('toString', pieces.target);
      },

      'should be deepest key when method and keys exists': function () {
        var pieces = this.Beget._parseNamespace('/backbone.View#extend');
        this.assert.equal('View', pieces.target);
      },

      'should be class in path when method exists and keys absent': function () {
        var pieces = this.Beget._parseNamespace('/Cat/Face#getWhiskers');
        this.assert.equal('Face', pieces.target);
      }
    }
  },

  '#_resolveImport': {
    beforeEach: function () {
      this.parsedNS = {};
      this.sinon = require('sinon').sandbox.create();
      this.stubFor_require = this.sinon.stub(this.Beget, '_require');
    },

    afterEach: function () {this.sinon.restore()},

    // todo: _resolveImport should accept parsed ns rather than string (to push up one level to _populateImportsOnto
    'should attempt to import module': function () {
      var ns = {isNamespaced: true, path: ["Cat", "Face", "Whiskers"]};
      this.sinon.stub(this.Beget, '_parseNamespace').returns(ns);
      this.Beget._resolveImport('/Cat/Face/Whiskers');
      this.assert(this.Beget._require.calledWith(ns));
    },

    'should lookup props from self when provided': function () {
      var count = this.Beget._resolveImport('#/Cat.whiskers.count', {Cat: {whiskers: {count: 900}}});
      this.assert(this.Beget._require.notCalled);
      this.assert.equal(900, count);
    },

    'should return module as is when keys absent': function () {
      this.stubFor_require.returns('some module');

      var module = this.Beget._resolveImport('/Cat/Face/Whiskers');
      this.assert.equal('some module', module);
    },

    'should return property of module with key when provided': function () {
      this.stubFor_require.returns({count: 900});

      var count = this.Beget._resolveImport('/Cat/Face/Whiskers.count');
      this.assert.equal(900, count);
    },

    'should return nested properties from module when provided': function () {
      this.stubFor_require.returns({whiskers: {count: 900}});

      var toString = this.Beget._resolveImport('/Cat/Face.whiskers.count.toString');
      this.assert.equal((900).toString, toString);
    },

    'should return bound method when method exists': function () {
      this.stubFor_require.returns({whiskers: {count: 900}});

      var toString = this.Beget._resolveImport('/Cat/Face.whiskers.count#toString');
      this.assert.equal('900', toString());
    }
  }
};
