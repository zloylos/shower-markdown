shower.modules.define('shower-markdown', [
    'shower',
    'util.extend'
], function (provide, showerGlobal, extend) {

    /**
     * @class
     * Markdown plugin for Shower.
     * @param {Shower} shower
     * @constructor
     */
    function MarkdownPlugin(shower) {
        this._shower = shower;
        this._md = markdownit();
        this._setup();
    }

    extend(MarkdownPlugin.prototype, {
        destroy: function () {
            this._shower = null;
        },

        _setup: function () {
            var slides = this._shower.getSlidesArray();
            slides.forEach(function (slide) {
                var slideElement = slide.layout.getElement();
                if (slideElement.classList.contains('markdown')) {
                    var htmlContent = slideElement.innerHTML;
                    var startSpacesCount = htmlContent.match(/\s+/)[0].length;
                    var content = htmlContent.split('\n').map(function (line) {
                        return line.slice(startSpacesCount - 1);
                    }).join('\n');
                    slideElement.innerHTML = this._md.render(content);
                }
            }, this);
        }
    });

    provide(MarkdownPlugin);
});

shower.modules.require(['shower'], function (sh) {
    sh.plugins.add('shower-markdown');
});
