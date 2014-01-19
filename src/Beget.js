var Array = [].constructor, 
    String = ''.constructor;

var Beget = {
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
    var parentNS = proto.extends || proto.inherits,
        Parent = parentNS ? Beget._resolveImport(parentNS) : function Parent() {},
        Child = proto.extends ? Parent.extend(proto) : Beget._inherit(Parent, proto);

    // set up constructor chaining
    Child.prototype.parent = Beget.__invokeParentWith;

    // create instance with provided args
    return new (Beget._applySurrogate(Child, function () {
      if (proto.hasOwnProperty('imports')) {Beget._populateImportsOnto(this, proto.imports)}
      Child.apply(this, args);
    }));
  },

  __invokeParentWith: function (namespace, etc) {
    return Beget._resolveImport(namespace).apply(this, Array.prototype.slice.call(arguments, 1));
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
  _extend: function (a, b) {if (b) {for (k in b) {a[k] = b[k]}}},
  
  /** Backbone's Surrogate extend */
  _inherit: function (Parent, proto) {
    var Child = proto && proto.hasOwnProperty('constructor') ? proto.constructor :
      function () {return Parent.apply(this, arguments)};

    Beget._extend(Child, Parent);
    Beget._applySurrogate(Parent, Child);
    Beget._extend(Child.prototype, proto);

    Child.__super__ = Parent.prototype;
    return Child;
  },

  _applySurrogate: function (Parent, Child) {
    function Surrogate() {this.constructor = Child}
    Surrogate.prototype = Parent.prototype;
    Child.prototype = new Surrogate;
    return Child;
  }
};

exports['/Beget'] = Beget;
