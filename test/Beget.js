var assert = require('assert'),
  beget = require('beget')['/Beget'].beget,
  Puppy = require('beget/src/bartho/hello/Puppy')['/beget/src/bartho/hello/Puppy'],
  Kitty = require('beget/src/bartho/hello/Kitty')['/beget/src/bartho/hello/Kitty'],
  _ = require('underscore');

exports['/beget/test/Beget'] = {
  '#beget()': {
    'should call constructor on delegate': function () {
      var wasCalled = false,
        delegate = {constructor: function () {wasCalled = true}};
      beget('/beget/src/bartho/hello/Kitty', delegate);
      assert.ok(wasCalled);
    },

    'should provide prototype\'s descendant to delegate constructor': function () {
      var delegate = {constructor: function (p) {this.p = p}};

      beget('/beget/src/bartho/hello/Puppy', delegate);
      assert(delegate.p instanceof require('backbone').Model);
    },

    'should return reference to new instance': function () {
      var delegate = {constructor: function (k) {this.k = k}},
        k = beget('/beget/src/bartho/hello/Kitty', delegate);
      assert.equal(k, delegate.k);
    },

    'should provide arguments to Kitty.constructor when second arg is list': function () {
      var k = beget('/beget/src/bartho/hello/Kitty', ['Fluffy']);
      assert.equal('Fluffy', k.name);
    },

    'should allow provision of raw prototype in place of namespace': function () {
      var p = beget(Puppy, ['Max']);
      assert(p instanceof require('backbone').Model);
      assert.equal('Max', p.name);
    },

    'should provide private top-level reference to imported prototype when just namespace': function () {
      var k = beget('/beget/src/bartho/hello/Kitty');
      assert.equal(Puppy, k._Puppy);
    },

    'should allow aliasing imports when dictionary': function () {
      var k = beget('/beget/src/bartho/hello/Kitty');
      assert.equal(Puppy, k._Dog);
    },

    'should allow import of entire module': function () {
      var k = beget('/beget/src/bartho/hello/Kitty');
      assert.equal(require('underscore'), k._);
    },

    'should allow method imports when dot-notation used': function () {
      var k = beget('/beget/src/bartho/hello/Kitty');
      assert.equal(require('backbone').View, k._View);
    },

    'should allow extension via extends prop': function () {
      var M = require('backbone').Model;
      var k = beget('/beget/src/bartho/hello/Kitty', [{id: 500}]);
      assert(k instanceof M);
      assert.deepEqual({id: 500}, k.name);
      assert.equal(M.prototype.set, k.set);
      assert.equal(500, k.get('id'));

    },

    'should allow inheritence via inherits prop': function () {
      var M = require('backbone').Model;
      var p = beget('/beget/src/bartho/hello/Puppy', [{id: 500}]);
      assert(p instanceof M);
      assert.deepEqual({id: 500}, p.name);
      assert.equal(M.prototype.set, p.set);
      assert.equal(500, p.get('id'));
    },

    'should resolve imports onto delegate': function () {},

    'should do something with binding to prevent muckups when aliasing': function () {},

    'should allow import namespace resolution based upon where it\'s aliased': function () {}
  }
};
