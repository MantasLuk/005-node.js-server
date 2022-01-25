const utils = {};

utils.fileExtension = (url) => {
    // css/pages/home.css -> css
    // css/pages/home.min.css -> css
    // css/pages/home.min.css?v=2.0.7 -> css

    const pathParts = url.split('.');
    return pathParts[pathParts.length - 1];
}

module.exports = utils;