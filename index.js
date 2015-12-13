var Plugin = require('./lib/Plugin');
shower.modules.define('shower-markdown', ['Slide'], function (provide, Slide) {
    Plugin.Slide = Slide;
    provide(Plugin);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-markdown');
});
