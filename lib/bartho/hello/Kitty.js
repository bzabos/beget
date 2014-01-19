exports['/beget/lib/bartho/hello/Kitty'] = {
  extends: '>backbone.Model',
  imports: [
    '/beget/lib/bartho/hello/Puppy',
    {'/beget/lib/bartho/hello/Puppy': '_Dog'},
    {'>underscore': '_'},
    {'>backbone.View': '_View'}
  ],
    
  constructor: function (name) {
    this.parent('>backbone.Model', name);
    this.name = name;
  }
};
