exports['/beget/lib/bartho/hello/Puppy'] = {
  inherits: '>backbone.Model',

  constructor: function (name) {
    this.parent('>backbone.Model', name);
    this.name = name;
  }
};
