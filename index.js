shower.modules.define('shower-markdown', function (provide) {
    var Plugin = require('./lib/Plugin');
    provide(Plugin);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-markdown');
});
