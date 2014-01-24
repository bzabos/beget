module.exports['/bgl/thi/views/profile/TrophyCase'] = {
    extends: ['/Backbone.View.extend'],
    imports: [
        {'>_': '_'},
        {'>$': '$$'},
        '/bartho/hello/World',
        {'>THI.renderTemplate': '_renderTemplate'},
        {'/com/bart/Beget': 'beget'}
    ],
    
    constructor: function () {
        this._(this).bindAll();
        this.$$('#carrots');
        this.$('h4 > span').html('hi');
        this.myWorld = this.beget('World', this._handleWorldCreatedDelegate);
    },
    
    _calculateStuff: function () {
      var adder = this.beget('#/Adder', [7, 4]);
      var queryset = this.$$('#hi!');
    },
    
    _handleWorldCreatedDelegate: {constructor: function (w) {w.name = 'World'}}
};
