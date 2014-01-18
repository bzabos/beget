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
  
  _begetFromProto: function (proto, args) {
    /**
    /THI.Views.DatePicker.extend
    
    We want a child of something that looks like Kitty, which has DatePicker in it's prototype
    [Catch] - We need child to be instantiated with a list of args.
    
    
    1. Bind extend to constructor
    2. Make Kitty via standard extends method (key this)
    3. Swap kitty constructor for something that does..
       a) 
    
    boundExtend = Beget.beget('/THI.Views.DatePicker:extend').extend.bind(DatePicker)
    Kitty = boundExtend(protoKitty)
    superKitty = new Kitty
    args = ['a', 'b', 'c']
    function X() {Kitty.apply(this, args)}
    X.prototype = superKitty;
    return new X;
    
    ---
    
    When there's an extends, there's an additional layer which is cached.
    We can reuse the above constructor arg application on standard beget
    We can even do import resolution on the cached prototype. (They're mutable, but the web is global anyway?)
    
    TODO: set up "super()"
    */
    
    
    
    var x = Beget._create(proto);
    if (x.imports) {Beget._populateImportsOnto(x, x.imports)}
    x.constructor.apply(x, args);
    return x;
  },
  
  _populateImportsOnto: function (x, imports) {
    for (var i = 0, namespace, namespaceIsAliased, alias, namespaceHasPropReferences, propRefs, module; 
             i < imports.length; i++) {
             
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
      
      namespaceHasPropReferences = namespace.indexOf('.') > -1;
      if (namespaceHasPropReferences) {
        propRefs = namespace.split('.');
        namespace = propRefs.splice(0, 1)[0];
      }
      
      mod = Beget._require(namespace);
      while (propRefs && propRefs.length) mod = mod[propRefs.shift()];
      x[alias] = mod;
    }
  },
  
  _create: Object.create || function (proto) {
    function X() {}
    X.prototype = proto;
    return new X;
  },
  
  _require: function (ns) {
    var exportType = ns.charAt(0), mod = require(ns.substr(1));
    return exportType === '/' ? mod[ns] : mod;
  },
  
  _isString: function (s) {return (s || s === '') && s.constructor === String},
  _isArray: function (a) {return a && a.constructor === Array},
  
  /** Backbone's Surrogate extend */
  _extend: function (parent, protoProps) {
    var child;
    if (protoProps && protoProps.hasOwnProperty('constructor')) {child = protoProps.constructor} 
    else {child = function () {return parent.apply(this, arguments)}}
    
    for (var prop in parent) {child[prop] = parent[prop]}
    
    var Surrogate = function () {this.constructor = child};
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    
    if (protoProps) {for (var prop in protoProps) {child.prototype[prop] = protoProps[prop]}}
    
    child.__super__ = parent.prototype;
    return child;
  }
};
