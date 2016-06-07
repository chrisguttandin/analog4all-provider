var fs = require('fs');

module.exports = {
    controller: 'ProviderController as vm',
    template: fs.readFileSync(__dirname + '/../views/provider.html', 'utf8')
};
