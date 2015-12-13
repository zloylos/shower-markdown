var markdownit = require('markdown-it');
var markdownitContainer = require('markdown-it-container');

var MARKDOWN_CLASS = 'markdown';
var MARKDOWN_CONTAINER = '.markdown-container';

/**
 * @class
 * Markdown plugin for Shower.
 * @param {Shower} shower
 * @constructor
 */
function MarkdownPlugin(shower) {
    this._shower = shower;
    this._md = markdownit({
        html: true,
        breaks: true
    });
    this._setup();
}

MarkdownPlugin.Slide = null;

MarkdownPlugin.prototype = {
    destroy: function () {
        this._shower = null;
    },

    _setup: function () {
        var container = this._shower.container.getElement();
        var markdownContainer = container.querySelector(MARKDOWN_CONTAINER);
        if (markdownContainer) {
            this._setupContainerPlugin();
            this._setupContainer(markdownContainer);
        } else {
            this._setupSlides();
        }
    },

    _setupContainerPlugin: function () {
        this._md.use(markdownitContainer, 'slide', {
            render: function (tokens, idx) {
                return tokens[idx].nesting === 1 ?
                    '<section class=\'slide\'>' :
                    '</section>\n';
            }
        });
    },

    _setupContainer: function (element) {
        var showerContainer = this._shower.container.getElement();
        var content = this._renderContent(element);
        var slidesElement = document.createElement('div');
        slidesElement.innerHTML = content;
        var slides = slidesElement.querySelectorAll('.slide');
        Array.prototype.slice.call(slides).forEach(function (slide) {
            slide.id = this._shower.getSlidesCount() + 1;
            showerContainer.appendChild(slide);
            this._shower.add(new MarkdownPlugin.Slide(slide));
        }, this);

        element.parentElement.removeChild(element);
        if (MarkdownPlugin.locationHash) {
            window.location.hash = MarkdownPlugin.locationHash;
        }
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
        element.innerHTML = this._renderContent(element);
    },

    _renderContent: function (element) {
        return this._md.render(removeIndents(element));
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

module.exports = MarkdownPlugin;
