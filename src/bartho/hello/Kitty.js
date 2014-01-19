exports['/beget/src/bartho/hello/Kitty'] = {
  extends: '>backbone.Model',
  imports: [
    '/beget/src/bartho/hello/Puppy',
    {'/beget/src/bartho/hello/Puppy': '_Dog'},
    {'>underscore': '_'},
    {'>backbone.View': '_View'}
  ],
    
  constructor: function (name) {
    this.parent('>backbone.Model', name);
    this.name = name;
  }
};
