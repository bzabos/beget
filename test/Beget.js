var assert = require('assert'),
    beget = require('beget')['/Beget'].beget,
    Puppy = require('beget/src/bartho/hello/Puppy')['/beget/src/bartho/hello/Puppy'],
    Kitty = require('beget/src/bartho/hello/Kitty')['/beget/src/bartho/hello/Kitty'],
    _ = require('underscore');
    
module.exports['/beget/test/Beget'] = {
  '#beget()': {
    'should call constructor on delegate': function () {
      var wasCalled = false,
          delegate = {constructor: function () {wasCalled = true}};
      beget('/beget/src/bartho/hello/Kitty', delegate);
      assert.ok(wasCalled);
    },
    
    'should provide prototype\'s descendant to delegate constructor': function () {
      var delegate = {constructor: function (p) {this.p = p}},
          p = Object.create(Puppy);
          p.constructor();
          
      beget('/beget/src/bartho/hello/Puppy', delegate);
      assert.deepEqual(p, delegate.p);
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
      var p = Object.create(Puppy);
          p.constructor('Max');
          
      assert.deepEqual(beget(Puppy, ['Max']), p);
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
    
    'should do something with binding to prevent muckups when aliasing': function () {},
    
    'should allow inheritence via inherits prop': function () {},
    
    'should allow extension via extends prop': function () {},
    
    'should allow import namespace resolution based upon where it\'s aliased': function () {}
  }
};
