var markdownit = require('markdown-it');
var markdownitContainer = require('markdown-it-container');

var MARKDOWN_CLASS = 'markdown';

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

MarkdownPlugin.prototype = {
    destroy: function () {
        this._shower = null;
    },

    _setup: function () {
        if (this._shower.container.getElement().classList.contains(MARKDOWN_CLASS)) {
            this._setupContainerPlugin();
            this._setupContainer();
        } else {
            this._setupSlides();
        }
    },

    _setupContainerPlugin: function () {
        this._md.use(markdownitContainer, 'slide', {
            validate: function (params) {
                return params.trim().match(/^slide\s+(.*)$/);
            },

            render: function (tokens, idx) {
                var m = tokens[idx].info.trim().match(/^slide\s+(.*)$/);
                if (tokens[idx].nesting === 1) {
                    return '<section class=\'slide\'>' + m[1];
                } else {
                    return '</section>\n';
                }
            }
        });
    },

    _setupContainer: function () {
        var element = this._shower.container.getElement();
        this._render(element);
    },

    _setupSlides: function () {
        var slides = this._shower.getSlides();
        slides.forEach(function (slide) {
            var slideElement = slide.layout.getElement();
            if (slideElement.classList.contains(MARKDOWN_CLASS)) {
                this._render(slideElement);
            }
        }, this);
    },

    _render: function (element) {
        var content = removeIndents(element);
        element.innerHTML = this._md.render(content);
    }
};

function removeIndents(element) {
    var htmlContent = element.innerHTML;
    var startSpacesCount = htmlContent.match(/\s+/)[0].length;
    return htmlContent
        .split('\n')
        .map(function (line) {
            return line.slice(startSpacesCount - 1);
        })
        .join('\n');
}
