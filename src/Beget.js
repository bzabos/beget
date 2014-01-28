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

  _parseNamespace: function (ns) {
    var exportType = ns.substr(0, 2) === '#/' ? '#/' : ns.charAt(0),
        method = ns.substr(exportType.length).split('#'),
        keys = method.shift().split('.'),
        path = keys.shift().split('/'),
        target = (keys.length && keys[keys.length - 1]) ||
                 (path.length && path[path.length - 1]) || ns;
    return {
      isLocal: exportType === '#/',
      isModule: exportType === '>',
      isNamespaced: exportType === '/',
      method: method[0] || null,
      keys: keys.length ? keys : null,
      path: path.length ? path : null,
      target: target};
  },

  _resolveImport: function (namespace, self) {
    var parsedNS = this._parseNamespace(namespace),
        mod = parsedNS.isLocal ? self[parsedNS.path.join('/')] : Beget._require(parsedNS),
        keys = parsedNS.keys && parsedNS.keys.slice();

    while (keys && keys.length) mod = mod[keys.shift()];
    return parsedNS.method ? function () {return mod[parsedNS.method].apply(mod, arguments)} : mod;
  },

//  _require: typeof(require) === 'undefined' ? function (ns) {
////    var exportType = ns.charAt(0);
////    return exportType === '/' ? exports[ns] : Beget.global[ns.substr(1)];
//    return Beget.global[ns] || Beget.global[ns.substr(1)] || Beget.global;
//  } : function (ns) {
//    var exportType = ns.charAt(0), mod = require(ns.substr(1));
//    return exportType === '/' ? mod[ns] : mod;
//  },

  _require: typeof(require) === 'undefined' ? function (parsedNS) {
    var path = parsedNS.isNamespaced ? '/' + parsedNS.path.join('/') : parsedNS.target,
        module = Beget.global;
    return module[path] || module;
  } : function (parsedNS) {
    var path = parsedNS.path.join('/'),
        module = require(path);
    return parsedNS.isNamespaced ? module['/' + path] : module;
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
