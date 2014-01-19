var Array = [].constructor, 
    String = ''.constructor;
    
var Beget = exports['/Beget'] = {
  beget: function (namespace, args, delegate) {
    var namespaceIsProto = !Beget._isString(namespace);
    var argsAreAbsent = arguments.length === 2 && !Beget._isArray(args);
    if (argsAreAbsent) {delegate = args}
    
    var x = Beget[namespaceIsProto ? '_begetFromProto' : '_begetFromNS'](namespace, args);
    if (delegate) {delegate.constructor(x)}
    
    return x;
  },
  
  _begetFromNS: function (namespace, args) {
    return Beget._begetFromProto(Beget._require(namespace), args);
  },

  // todo: we need to cache Child to avoid recreating prototype every beget
  // todo: we need to cache initial resolution to avoid parse+require
  // todo: we need to use reference for parent method to avoid recreating it
  // todo: we need to extract surrogate functionality as it's duplicated
  _begetFromProto: function (proto, args) {
    // decide how we want to procreate
    var Parent, Child;
    if (proto.extends) {
      Parent = Beget._resolveImport(proto.extends);
      Child = Parent.extend(proto);
    } else {
      Parent = proto.inherits ? Beget._resolveImport(proto.inherits) : function Parent() {};
      Child = Beget._extend(Parent, proto);
    }

    // set up constructor chaining
    Child.prototype.parent = function (namespace, etc) {
      Beget._resolveImport(namespace).apply(this, Array.prototype.slice.call(arguments, 1));
    };

    // create instance with above args
    function Infant() {
      if (proto.hasOwnProperty('imports')) {Beget._populateImportsOnto(this, proto.imports)}
      Child.apply(this, args);
    }
    
    var Surrogate = function () {this.constructor = Infant};
    Surrogate.prototype = Child.prototype;
    Infant.prototype = new Surrogate;
    // end arg infusion
    
    return new Infant;
  },
  
  _populateImportsOnto: function (x, imports) {
    for (var i = 0, namespace, namespaceIsAliased, alias; i < imports.length; i++) {
      namespace = imports[i];
      namespaceIsAliased = !Beget._isString(namespace);
      
      if (namespaceIsAliased) {
        for (var key in namespace) {
          if (!namespace.hasOwnProperty(key)) {continue}
          alias = namespace[key]; 
          namespace = key; 
          break;
        }
      } else {alias = '_' + namespace.split('/').pop()}
      
      x[alias] = this._resolveImport(namespace);
    }
  },
  
  _resolveImport: function (namespace) {
    var namespaceHasPropReferences = namespace.indexOf('.') > -1, propRefs;
    if (namespaceHasPropReferences) {
      propRefs = namespace.split('.');
      namespace = propRefs.splice(0, 1)[0];
    }
    
    var mod = Beget._require(namespace);
    while (propRefs && propRefs.length) mod = mod[propRefs.shift()];
    return mod;
  },
  
  _require: function (ns) {
    var exportType = ns.charAt(0), mod = require(ns.substr(1));
    return exportType === '/' ? mod[ns] : mod;
  },
  
  _isString: function (s) {return (s || s === '') && s.constructor === String},
  _isArray: function (a) {return a && a.constructor === Array},
  
  /** Backbone's Surrogate extend */
  _extend: function (Parent, proto) {
    var Child, prop;
    if (proto && proto.hasOwnProperty('constructor')) {Child = proto.constructor}
    else {Child = function () {return Parent.apply(this, arguments)}}
    
    for (prop in Parent) {Child[prop] = Parent[prop]}
    
    var Surrogate = function () {this.constructor = Child};
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate;
    
    if (proto) {for (prop in proto) {Child.prototype[prop] = proto[prop]}}

    Child.__super__ = Parent.prototype;
    return Child;
  }
};
