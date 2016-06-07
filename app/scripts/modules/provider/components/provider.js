var fs = require('fs');

export const provider = {
    controller: 'ProviderController as vm',
    template: fs.readFileSync(__dirname + '/../views/provider.html', 'utf8')
};
