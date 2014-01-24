this['/beget/lib/bartho/hello/Kitty'] = {
  extends: '>backbone.Model',
  imports: [
    '/beget/lib/bartho/hello/Puppy',
    {'/beget/lib/bartho/hello/Puppy': 'Dog'},
    {'>underscore': '_'},
    '>backbone.View',
    {'>backbone.View': 'View'}],
    
  constructor: function (name) {
    this.parent('>backbone.Model', name);
    this.name = name;
  },

  getFuncContext: function () {return this}
};
