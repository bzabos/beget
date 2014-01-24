this['/beget/test/Beget'] = {
  setUp: function () {
    this.assert = require('assert');
    this.underscore = require('underscore');
    this.Model = require('backbone').Model;
    this.View = require('backbone').View;
    this.beget = require('beget')['/Beget'].beget;
    this.Puppy = require('beget/lib/bartho/hello/Puppy')['/beget/lib/bartho/hello/Puppy'];
  },

  '#beget()': {
    'should call constructor on delegate': function () {
      var wasCalled = false,
          delegate = {constructor: function () {wasCalled = true}};
      this.beget('/beget/lib/bartho/hello/Kitty', delegate);
      this.assert.ok(wasCalled);
    },

    'should provide prototype\'s descendant to delegate constructor': function () {
      var assert = this.assert, Model = this.Model;
      this.beget('/beget/lib/bartho/hello/Puppy', {
        constructor: function (p) {
          assert(p instanceof Model);
        }
      });
    },

    'should return reference to new instance': function () {
      var kProvidedToDel,
          kReturnedFromBeget = this.beget('/beget/lib/bartho/hello/Kitty', {constructor: function (k) {kProvidedToDel = k}});
      this.assert(kProvidedToDel);
      this.assert.equal(kProvidedToDel, kReturnedFromBeget);
    },

    'should provide arguments to Kitty.constructor when second arg is list': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty', ['Fluffy']);
      this.assert.equal('Fluffy', k.name);
    },

    'should allow provision of raw prototype in place of namespace': function () {
      var p = this.beget(this.Puppy, ['Max']);
      this.assert(p instanceof this.Model);
      this.assert.equal('Max', p.name);
    },

    'should provide private top-level reference to imported prototype when just namespace': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty');
      this.assert.equal(this.Puppy, k._Puppy);
    },

    'should allow aliasing imports when dictionary': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty');
      this.assert.equal(this.Puppy, k.Dog);
    },

    'should allow import of entire module': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty');
      this.assert.equal(this.underscore, k._);
    },

    'should allow aliased method imports when dot-notation used': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty');
      this.assert.equal(this.View, k.View);
    },

    'should allow defaulted imports when dot-notation used': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty');
      this.assert.equal(this.View, k._View);
    },

    'should allow extension via extends prop': function () {
      var k = this.beget('/beget/lib/bartho/hello/Kitty', [{id: 500}]);
      this.assert(k instanceof this.Model);
      this.assert.deepEqual({id: 500}, k.name);
      this.assert.equal(this.Model.prototype.set, k.set);
      this.assert.equal(500, k.get('id'));
    },

    'should allow inheritence via inherits prop': function () {
      var p = this.beget('/beget/lib/bartho/hello/Puppy', [{id: 500}]);
      this.assert(p instanceof this.Model);
      this.assert.deepEqual({id: 500}, p.name);
      this.assert.equal(this.Model.prototype.set, p.set);
      this.assert.equal(500, p.get('id'));
    },

    'should resolve imports onto delegate': function () {
      var assert = this.assert, View = this.View;
      this.beget('/beget/lib/bartho/hello/Puppy', {
        imports: ['>backbone.View'],
        constructor: function () {
          assert.equal(View, this._View);
        }
      });
    },

    'should allow bound method imports to prevent muckups when aliasing': function () {
      var assert = this.assert;
      this.beget('/beget/lib/bartho/hello/Kitty', {
        imports: [
          '/beget/lib/bartho/hello/Kitty',
          '/beget/lib/bartho/hello/Kitty#getFuncContext'],
        constructor: function () {
          assert(this._Kitty === this._getFuncContext());
        }
      });
    },

    'should allow local import namespace resolution based upon where it\'s aliased': function () {
      var assert = this.assert, Model = this.Model;
      this.beget('/beget/lib/bartho/hello/Kitty', {
        imports: [
          {'/beget/lib/bartho/hello/Puppy': 'Pup'},
          {'/Beget.beget': 'beget'}],

        constructor: function () {
          var p = this.beget('#/Pup');
          assert(p instanceof Model);
        }
      });
    }

//    'should allow dot-notation within local import resolution': function () {
//      var assert = this.assert, View = this.View;
//      this.beget('/beget/lib/bartho/hello/Kitty', {
//        imports: [
//          {'>backbone': 'Backbone'},
//          {'/Beget.beget': 'beget'}],
//
//        constructor: function () {
//          var v = this.beget('#/Backbone.View', [{id: 500}]);
//          var v = new this.Backbone.View({id: 500});
//
//          assert(v instanceof View);
//          assert.equal(500, v.id);
//        }
//      });
//    }

    // todo: we need to cache Child to avoid recreating prototype every beget
    // todo: we need to cache initial resolution to avoid parse+require
    // todo: we need to use reference for parent method to avoid recreating it
  }
};
