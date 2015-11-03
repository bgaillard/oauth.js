/**
 * Abstract class common to all OAuth.JS Request Managers.
 * 
 * @author Baptiste GAILLARD (baptiste.gaillard@gomoob.com)
 */
OAuth.Request.AbstractRequestManager = function(configuration) {
    
    /**
     * A component used to parse server responses to requests on the OAuth 2.0 Token Endpoint.
     * 
     * @instance
     * @private
     * @type {OAuth.AccessToken.ResponseParser}
     */
    this._accessTokenResponseParser = new OAuth.AccessToken.ResponseParser();
    
    /**
     * The function used to retrieve credentials to get an OAuth 2.0 Access Token.
     * 
     * @instance
     * @private
     */
    // TODO: A documenter mieux que celà (notamment le type)...
    this._loginFn = null;
    
    /**
     * The function used to parse errors returned by the Web Services.
     * 
     * @instance
     * @private
     */
    // TODO: A documenter mieux que celà (notamment le type)...
    this._parseErrorFn = null;

    /**
     * The storage manager used to manage persistence of OAuth 2.0 tokens on client side.
     * 
     * @instance
     * @private
     * @type {OAuth.StorageManager}
     */
    this._storageManager = null;
    
    /**
     * The URL to the token endpoint used to retrieve an access and a refresh token.
     * 
     * @instance
     * @private
     * @type {String}
     */
    this._tokenEndpoint = null;
    
    /**
     * Function used to determine if a user is logged in to your application. 
     * 
     * @param {Function} cb TODO A DOCUMENTER
     * @returns {Boolean} forceServerCall TODO A DOCUMENTER
     */
    this.getLoginStatus = function(cb, forceServerCall) {

        // TODO: Pour le moment on utilise pas le tag 'forceServerCall', ce tag est défini de manière à avoir une 
        //       fonction 'getLoginStatus' très similaire à ce que défini le client Facebook FB.getLoginStatus()... Plus 
        //       tard il faudra même que la date côté client soit comparée à la date d'expiration du Token pour voir si 
        //       on considère que le client est connecté ou non...
        // TODO: Il faudrait également que l'on prévoit des événements Javascript de la même manière que ce que fait 
        //       Facebook

        // Very simple, simply call the provided callback with the stored AuthStatus
        cb(this._storageManager.getAuthStatus());

    };
    
    /**
     * Function used to logout a user.
     * 
     * @param logoutCb A callback to be called after the logout is done.
     */
    this.logout = function(logoutCb) {
      
        // Clears the storage manage by the storage manager
        // FIXME: Le logout devrait persister un AuthStatus disconnected à la place...
        this._storageManager.clear();

        // Calls the provided callback function
        logoutCb();

    };

};
