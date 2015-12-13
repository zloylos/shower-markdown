var Plugin = require('./lib/Plugin');
var locationHash = window.location.hash;

shower.modules.define('shower-markdown', ['Slide'], function (provide, Slide) {
    Plugin.Slide = Slide;
    Plugin.locationHash = locationHash;
    provide(Plugin);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-markdown');
});
