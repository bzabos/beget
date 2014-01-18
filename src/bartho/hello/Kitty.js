exports['/beget/src/bartho/hello/Kitty'] = {
  
  extends: '>backbone.View',//':extend',
  
  // inherits: ['/Object'],
  
  imports: [
    '/beget/src/bartho/hello/Puppy',
    {'/beget/src/bartho/hello/Puppy': '_Dog'},
    {'>underscore': '_'},
    {'>backbone.View': '_View'}
  ],
    
  constructor: function (name) {this.name = name}
}
