var assert = require('assert'),
    beget = require('bartho/Beget')['/bartho/Beget'].beget,
    Puppy = require('bartho/hello/Puppy')['/bartho/hello/Puppy'],
    Kitty = require('bartho/hello/Kitty')['/bartho/hello/Kitty'],
    _ = require('underscore');
    
module.exports = {
  'Beget': {
    '#beget()': {
      'should call constructor on delegate': function () {
        var wasCalled = false,
            delegate = {constructor: function () {wasCalled = true}};
        beget('/bartho/hello/Kitty', delegate);
        assert.ok(wasCalled);
      },
      
      'should provide prototype\'s descendant to delegate constructor': function () {
        var delegate = {constructor: function (p) {this.p = p}},
            p = Object.create(Puppy);
            p.constructor();
        
        beget('/bartho/hello/Puppy', delegate);
        assert.deepEqual(p, delegate.p);
      },
      
      'should return reference to new instance': function () {
        var delegate = {constructor: function (k) {this.k = k}},
            k = beget('/bartho/hello/Kitty', delegate);
        assert.equal(k, delegate.k);
      },
      
      'should provide arguments to Kitty.constructor when second arg is list': function () {
        var k = beget('/bartho/hello/Kitty', ['Fluffy']);
        assert.equal('Fluffy', k.name);
      },
      
      'should allow provision of raw prototype in place of namespace': function () {
        var p = Object.create(Puppy);
            p.constructor('Max');
            
        assert.deepEqual(beget(Puppy, ['Max']), p);
      },
      
      'should provide private top-level reference to imported prototype when just namespace': function () {
        var k = beget('/bartho/hello/Kitty');
        assert.equal(Puppy, k._Puppy);
      },
      
      'should allow aliasing imports when dictionary': function () {
        var k = beget('/bartho/hello/Kitty');
        assert.equal(Puppy, k._Dog);
      },
      
      'should allow import of entire module': function () {
        var k = beget('/bartho/hello/Kitty');
        assert.equal(require('underscore'), k._);
      },
      
      'should allow method imports when dot-notation used': function () {
        var k = beget('/bartho/hello/Kitty');
        assert.equal(require('backbone').View, k._View);
      }, 
      
      'should allow inheritence via inherits prop': function () {
        
      },
      
      'should allow extension via extends prop': function () {
        
      }
      
    }
  }
};















