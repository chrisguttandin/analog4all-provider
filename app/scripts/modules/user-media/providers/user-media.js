var UserMediaService = require('../services/user-media.js');

class UserMediaServiceProvider {

    /**
     * This property is true if the browser supports all the required APIs to use the
     * UserMediaService. The code is roughly copied from [Modernizr's feature detection tests]
     * {@link https://github.com/Modernizr/Modernizr/blob/master/feature-detects/}
     */
    get isSupported () {
        return ('navigator' in window && 'webkitGetUserMedia' in window.navigator);
    }

    $get () {
        return new UserMediaService();
    }
}

module.exports = UserMediaServiceProvider;
