/**
 * Component used to manage persistance of a user connection state on client side.
 *
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.Storage.WebStorage = function(configuration) {

    /**
     * A component used to parse server responses to requests on the OAuth 2.0 Token Endpoint.
     *
     * @instance
     * @private
     * @type {OAuth.AccessToken.ResponseParser}
     */
    this._accessTokenResponseParser = new OAuth.AccessToken.ResponseParser();

    /**
     * The storage used to store the Access Token Response, 2 kinds of storage are supported.
     *
     *  * `localStorage`   : To use the browser local storage.
     *  * `sessionStorage` : To use the browser session storage.
     *
     * @property {Storage}
     */
    this._storage = localStorage;

    /**
     * The key used to store the Access Token Response inside the Web Storage.
     *
     * @param {String}
     */
    this._storageKey = 'oauth.js';

    // If no Web Storage is available in the browser
    if(typeof Storage === 'undefined') {

        throw new Error('Your browser does not support HTML5 Web Storage !');

    }

    // If a specific configuration is provided
    if(OAuth.ObjectUtils.isObject(configuration)) {

        // Configure the storage class
        if ((configuration.hasOwnProperty('storage')) &&
            (typeof configuration.storage === 'object')) {

            this._storage = configuration.storage;

        } else {

            this._storage = localStorage;

        }

        // Configure the storage key
        this._storageKey = typeof configuration.storageKey === 'string' ? configuration.storageKey : 'oauth.js';

    }

};

OAuth.Storage.WebStorage.prototype = {

    /**
     * Clear all the informations stored using this storage manage.
     */
    clear : function() {

        this._storage.removeItem(this._storageKey + '.authStatus');

    },

    getAuthStatusKey : function() {

        return this._storageKey + '.authStatus';

    },

    // TODO: A documenter et tester...
    getAuthStatus : function() {

        var authStatus = null,
            authStatusString = null;

        // Retrieve the AuthStatus string representation from the storage
        authStatusString = this._storage.getItem(this.getAuthStatusKey());

        // If an AuthStatus string has been found on the storage
        if(authStatusString) {

            // Creates the AuthStatus object by parsing the AuthStatus string
            authStatus = OAuth.AuthStatus.createFromString(authStatusString);

        }

        // Create a disconnected AuthStatus
        else {

            authStatus = new OAuth.AuthStatus({ status : OAuth.AuthStatus.DISCONNECTED });

        }

        // We always update the AuthStatus in the storage. This is VERY IMPORTANT because if the AuthStatus has been
        // manually updated outside the application and the data in the storage are corrupted we have to refresh those
        // data to valid values.
        this.persistAuthStatus(authStatus);

        return authStatus;

    },

    /**
     * Gets the last Refresh Token stored.
     *
     * @return {String} The last Refresh Token stored.
     */
    getRefreshToken : function() {

        var accessTokenResponse = this.getAccessTokenResponse(),
            refreshToken = accessTokenResponse !== null ? accessTokenResponse.refresh_token : null;

        // Returns null or a valid token (undefined is always converted to null)
        return refreshToken === null || refreshToken === undefined ? null : refreshToken;

    },

    // TODO: A blinder, documenter et tester...
    persistAuthStatus : function(authStatus) {

        this._storage.setItem(this.getAuthStatusKey(), authStatus.toString());

    },

    /**
     * Function used to persist an Access Token Response from a specified {@link XMLHttpRequest} object.
     *
     * @param {XMLHttpRequest} xhr An {@link XMLHttpRequest} object which was used to send a POST HTTP request to an
     *        OAuth 2.0 Token Endpoint.
     *
     * @return {OAuth.AuthStatus} A resulting {@link OAuth.Status} object which describe the user connection state which
     *         has been persisted on the storage.
     */
    persistAccessTokenResponse : function(xhr) {

        // The 'xhr' parameter must be an object
        if(typeof xhr !== 'object') {

            throw new Error(
                'The provided XHMLHttpRequest object is invalid !'
            );

        }

        // The XMLHttpRequest object must be in the 'DONE' state
        if(xhr.readyState !== XMLHttpRequest.DONE) {

            throw new Error(
                'The provided XHMLHttpRequest object must be in the DONE state before used for persistance !'
            );

        }

        var accessTokenResponse = null,
            authStatus = null;

        // Parse the Access Token Response
        accessTokenResponse = this._accessTokenResponseParser.parse(xhr);

        // Creates the AuthStatus object
        authStatus = new OAuth.AuthStatus(
            {
                status : accessTokenResponse.isSuccessful() ? OAuth.AuthStatus.CONNECTED : OAuth.AuthStatus.DISCONNECTED,
                accessTokenResponse : accessTokenResponse
            }
        );

        // Persists the new AuthStatus object
        this.persistAuthStatus(authStatus);

        return authStatus;

    }

};