var Beget = {
  Array: [].constructor,
  String: ''.constructor,
  global: function () {return this}(),

  beget: function (namespace, args, delegate) {
    var self = this !== Beget && this,
        namespaceIsProto = !Beget._isString(namespace),
        argsAreAbsent = arguments.length === 2 && !Beget._isArray(args);
    if (argsAreAbsent) {delegate = args}

    var x = Beget[namespaceIsProto ? '_begetFromProto' : '_begetFromNS'](namespace, args, self);
    if (delegate) {Beget._begetFromProto(delegate, [x], self)}
    return x;
  },

  _begetFromNS: function (namespace, args, self) {
    return Beget._begetFromProto(Beget._resolveImport(namespace, self), args, self);
  },

  _begetFromProto: function (proto, args, self) {
    // decide how we want to procreate
    var parentNS = proto.extends || proto.inherits,
        Parent = parentNS ? Beget._resolveImport(parentNS, self) : function Parent() {},
        Child = proto.extends ? Parent.extend(proto) : Beget._inherit(Parent, proto);

    // set up constructor chaining
    Child.prototype.parent = Beget.__invokeParentWith;

    // create instance with provided args
    return new (Beget._applySurrogate(Child, function () {
      if (proto.hasOwnProperty('imports')) {Beget._populateImportsOnto(this, proto.imports, self)}
      Child.apply(this, args);
    }));
  },

  __invokeParentWith: function (namespace, etc) {
    return Beget._resolveImport(namespace).apply(this, Beget.Array.prototype.slice.call(arguments, 1));
  },

  _populateImportsOnto: function (x, imports, self) {
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
      } else {alias = '_' + namespace.split('/').pop().split('.').pop().split('#').pop()}

      x[alias] = this._resolveImport(namespace, self);
    }
  },

  _extractNSPieces: function (ns) {
    var exportType = ns.substr(0, 2) === '#/' ? '#/' : ns.charAt(0);

    var methodStart = ns.lastIndexOf('#'),
        hasMethod = methodStart !== -1 && methodStart !== 0,
        method = hasMethod ? ns.substr(methodStart + 1, ns.length) : null;


    var pathStart = ns.indexOf('/'),
        hasPath = pathStart !== -1,
        path = hasPath ? ns.substr(pathStart + 1, hasMethod ? ns.length - method.length - pathStart - 2 : ns.length).split('/') : null;

    var keysStart = ns.indexOf('.'),
        hasKeys = keysStart !== -1,
        keys = hasKeys ? ns.substr(keysStart + 1, hasMethod ? ns.length - method.length - keysStart - 2 : ns.length).split('.') : null;

    var target = hasKeys ? keys[keys.length - 1] : hasPath ? path[path.length - 1] : ns.substr(exportType.length);

    return {exportType: exportType, target: target, method: method, keys: keys, path: path};
  },

  // todo: extract piece parsing then provide (alias?, exportType[ns, local, global], path, keys, method)
  _resolveImport: function (namespace, self) {
//    var pieces = this._extractNSPieces(namespace);

    var namespaceHasBoundReference = namespace.indexOf('#') > 1, methodToBind;
    if (namespaceHasBoundReference) {
      var sepIndex = namespace.indexOf('#');
      methodToBind = namespace.substr(sepIndex + 1);
      namespace = namespace.substr(0, sepIndex);
    }

    var namespaceHasPropReferences = namespace.indexOf('.') > -1, propRefs;
    if (namespaceHasPropReferences) {
      propRefs = namespace.split('.');
      namespace = propRefs.splice(0, 1)[0];
    }

    var namespaceIsLocalReference = self && namespace.charAt(0) === '#',
        mod = namespaceIsLocalReference ? self[namespace.substr(2)] : Beget._require(namespace);
    while (propRefs && propRefs.length) mod = mod[propRefs.shift()];

    var boundMethod;
    if (methodToBind) {
      boundMethod = function () {return mod[methodToBind].apply(mod, arguments)};
    }

    return boundMethod || mod;
  },

  _require: typeof(require) === 'undefined' ? function (ns) {
//    var exportType = ns.charAt(0);
//    return exportType === '/' ? exports[ns] : Beget.global[ns.substr(1)];
    return Beget.global[ns] || Beget.global[ns.substr(1)] || Beget.global;
  } : function (ns) {
    var exportType = ns.charAt(0), mod = require(ns.substr(1));
    return exportType === '/' ? mod[ns] : mod;
  },

  _isString: function (s) {return (s || s === '') && s.constructor === Beget.String},
  _isArray: function (a) {return a && a.constructor === Beget.Array},
  _extend: function (a, b) {if (b) {for (var k in b) {a[k] = b[k]}}},

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

this['/Beget'] = Beget;
