exports['/beget/test/Beget'] = {
  setUp: function () {
    this.assert = require('assert');
    this.Model = require('backbone').Model;
    this.View = require('backbone').View;
    this.beget = require('beget')['/Beget'].beget;
    this.Puppy = require('beget/src/bartho/hello/Puppy')['/beget/src/bartho/hello/Puppy'];
  },

  '#beget()': {
    'should call constructor on delegate': function () {
      var wasCalled = false,
        delegate = {constructor: function () {wasCalled = true}};
      this.beget('/beget/src/bartho/hello/Kitty', delegate);
      this.assert.ok(wasCalled);
    },

    'should provide prototype\'s descendant to delegate constructor': function () {
      var delegate = {constructor: function (p) {this.p = p}};

      this.beget('/beget/src/bartho/hello/Puppy', delegate);
      this.assert(delegate.p instanceof this.Model);
    },

    'should return reference to new instance': function () {
      var delegate = {constructor: function (k) {this.k = k}},
        k = this.beget('/beget/src/bartho/hello/Kitty', delegate);
      this.assert.equal(k, delegate.k);
    },

    'should provide arguments to Kitty.constructor when second arg is list': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty', ['Fluffy']);
      this.assert.equal('Fluffy', k.name);
    },

    'should allow provision of raw prototype in place of namespace': function () {
      var p = this.beget(this.Puppy, ['Max']);
      this.assert(p instanceof this.Model);
      this.assert.equal('Max', p.name);
    },

    'should provide private top-level reference to imported prototype when just namespace': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty');
      this.assert.equal(this.Puppy, k._Puppy);
    },

    'should allow aliasing imports when dictionary': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty');
      this.assert.equal(this.Puppy, k._Dog);
    },

    'should allow import of entire module': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty');
      this.assert.equal(require('underscore'), k._);
    },

    'should allow method imports when dot-notation used': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty');
      this.assert.equal(this.View, k._View);
    },

    'should allow extension via extends prop': function () {
      var k = this.beget('/beget/src/bartho/hello/Kitty', [{id: 500}]);
      this.assert(k instanceof this.Model);
      this.assert.deepEqual({id: 500}, k.name);
      this.assert.equal(this.Model.prototype.set, k.set);
      this.assert.equal(500, k.get('id'));
    },

    'should allow inheritence via inherits prop': function () {
      var p = this.beget('/beget/src/bartho/hello/Puppy', [{id: 500}]);
      this.assert(p instanceof this.Model);
      this.assert.deepEqual({id: 500}, p.name);
      this.assert.equal(this.Model.prototype.set, p.set);
      this.assert.equal(500, p.get('id'));
    },

    'should resolve imports onto delegate': function () {},

    'should do something with binding to prevent muckups when aliasing': function () {},

    'should allow import namespace resolution based upon where it\'s aliased': function () {}
  }
};
