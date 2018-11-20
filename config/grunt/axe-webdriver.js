const { defaultProject, projects } = require('../../angular.json');

module.exports = {
    chrome: {
        options: {
            browser: 'chrome'
        },
        urls: [
            `http://localhost:${ projects[defaultProject].targets.serve.options.port }`
        ]
    }
};
