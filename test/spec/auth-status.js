/*jshint -W030 */

describe('OAuth.AuthStatus : ', function() {
    
    describe('When calling the constructor with bad parameters', function() {
        
        it('should throw an error', function() {
    
            // Test with no settings object
            expect(function() {
                return new OAuth.AuthStatus();
            }).to.throw(
                Error, 
                'This object must be initialized with a settings object !'
            );
            
            // Test with a settings object of bad type
            expect(function() {
                return new OAuth.AuthStatus('bad_type');
            }).to.throw(
                Error, 
                'This object must be initialized with a settings object !'
            );
            
            // Test with a settings object attached to no status
            expect(function() {
                return new OAuth.AuthStatus({});
            }).to.throw(
                Error, 
                'The settings object has no status property or an invalid status property !'
            );
            
            // Test with a settings object attached to a bad status
            expect(function() {
                return new OAuth.AuthStatus({ status : 'invalid' });
            }).to.throw(
                Error, 
                'The settings object has no status property or an invalid status property !'
            );
            
            // Test with a settings object with no accessTokenReponse
            expect(function() {
                return new OAuth.AuthStatus(
                    { 
                        status : 'connected' 
                    }
                );
            }).to.throw(
                Error, 
                'The settings object has not access token response object or an invalid access token response object !'
            );
            
            // Test with a settings object attached to a bad accessTokenResponse
            expect(function() {
                return new OAuth.AuthStatus(
                    { 
                        status : 'connected',
                        accessTokenResponse : 'bad_type'
                    }
                );
            }).to.throw(
                Error, 
                'The settings object has not access token response object or an invalid access token response object !'
            );
            
        });
        
    });
    
    describe('When calling the constructor with good parameters', function() {
        
        it('should not throw an error', function() {
            
            new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
        });
        
    });
    
    describe('When calling the \'getAccessTokenResponse()\'', function() {
        
        it('should return the Access Token Response configured in the constructor', function() {
            
            var accessTokenResponse = new OAuth.AccessToken.SuccessfulResponse(),
                authStatus = new OAuth.AuthStatus(
                    {
                        status : 'connected', 
                        accessTokenResponse : accessTokenResponse
                    }
                );
            
            expect(authStatus.getAccessTokenResponse()).to.equal(accessTokenResponse);
            
        });
        
    });
    
    describe('When calling the \'isConnected()\' with a \'connected\' status', function() {
        
        it('should return true', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isConnected()).to.be.true;
            
        });
        
    });
    
    describe('When calling the \'isConnected()\' with a \'disconnected\' status', function() {
        
        it('should return false', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'disconnected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isConnected()).to.be.false;
            
        });
        
    });
    
    describe('When calling the \'isDisconnected()\' with a \'connected\' status', function() {
        
        it('should return false', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isDisconnected()).to.be.false;
            
        });
        
    });
    
    describe('When calling the \'isDisconnected()\' with a \'disconnected\' status', function() {
        
        it('should return true', function() {
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'disconnected', 
                    accessTokenResponse : new OAuth.AccessToken.SuccessfulResponse()
                }
            );
            
            expect(authStatus.isDisconnected()).to.be.true;
            
        });
        
    });
    
    describe('When calling \'toJSON()\'', function() {
        
        it('should return a valid json object', function() {
            
            // Create a fake XMLHttpRequest object
            // @see https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
            var xhr = new XMLHttpRequest();
            xhr.readyState = xhr.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = 'RESPONSE';
            xhr.responseText = 'RESPONSE_TEXT';
            xhr.responseXML = 'RESPONSE_XML';
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('invalid_grant');
            accessTokenResponse.setJsonResponse(
                {
                    access_token : 'access_token',
                    refresh_token : 'refresh_token',
                    expires_in : 3600
                }
            );
            accessTokenResponse.setXhr(xhr);
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected',
                    accessTokenResponse : accessTokenResponse
                }
            );
            
            var jsonObject = authStatus.toJSON();
            expect(Object.keys(jsonObject).length).to.equal(2);
            expect(jsonObject.hasOwnProperty('status')).to.be.true;
            expect(jsonObject.hasOwnProperty('accessTokenResponse')).to.be.true;
            expect(jsonObject.status).to.equal('connected');            
            expect(Object.keys(jsonObject.accessTokenResponse).length).to.equal(3);
            expect(jsonObject.accessTokenResponse.hasOwnProperty('error')).to.be.true;
            expect(jsonObject.accessTokenResponse.hasOwnProperty('jsonResponse')).to.be.true;
            expect(jsonObject.accessTokenResponse.hasOwnProperty('xhr')).to.be.true;
            expect(jsonObject.accessTokenResponse.error).to.equal('invalid_grant');
            expect(Object.keys(jsonObject.accessTokenResponse.jsonResponse).length).to.equal(3);
            expect(jsonObject.accessTokenResponse.jsonResponse.access_token).to.equal('access_token');
            expect(jsonObject.accessTokenResponse.jsonResponse.refresh_token).to.equal('refresh_token');
            expect(jsonObject.accessTokenResponse.jsonResponse.expires_in).to.equal(3600);
            expect(Object.keys(jsonObject.accessTokenResponse.xhr).length).to.equal(6);
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('readyState')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('status')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('statusText')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('response')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('responseText')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.hasOwnProperty('responseXML')).to.be.true;
            expect(jsonObject.accessTokenResponse.xhr.readyState).to.equal(xhr.DONE);
            expect(jsonObject.accessTokenResponse.xhr.status).to.equal(200);
            expect(jsonObject.accessTokenResponse.xhr.statusText).to.equal('OK');
            expect(jsonObject.accessTokenResponse.xhr.response).to.equal('RESPONSE');
            expect(jsonObject.accessTokenResponse.xhr.responseText).to.equal('RESPONSE_TEXT');
            expect(jsonObject.accessTokenResponse.xhr.responseXML).to.equal('RESPONSE_XML');

        });
        
    });
    
    describe('When calling \'toString()\'', function() {
        
        it('should return a valid string', function() {
        
            // Create a fake XMLHttpRequest object
            // @see https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
            var xhr = new XMLHttpRequest();
            xhr.readyState = xhr.DONE;
            xhr.status = 200;
            xhr.statusText = 'OK';
            xhr.response = 'RESPONSE';
            xhr.responseText = 'RESPONSE_TEXT';
            xhr.responseXML = 'RESPONSE_XML';
            
            var accessTokenResponse = new OAuth.AccessToken.ErrorResponse();
            accessTokenResponse.setError('invalid_grant');
            accessTokenResponse.setJsonResponse(
                {
                    access_token : 'access_token',
                    refresh_token : 'refresh_token',
                    expires_in : 3600
                }
            );
            accessTokenResponse.setXhr(xhr);
            
            var authStatus = new OAuth.AuthStatus(
                {
                    status : 'connected',
                    accessTokenResponse : accessTokenResponse
                }
            );
            
            var string = authStatus.toString();
            expect(string).to.equal(
                '{' +
                    '"status":"connected",' + 
                    '"accessTokenResponse":{' +
                        '"error":"invalid_grant",' + 
                        '"jsonResponse":{' +
                            '"access_token":"access_token",' + 
                            '"refresh_token":"refresh_token",' + 
                            '"expires_in":3600' +
                        '},' +
                        '"xhr":{' +
                            '"readyState":4,' + 
                            '"status":200,' +
                            '"statusText":"OK",' +
                            '"response":"RESPONSE",' + 
                            '"responseText":"RESPONSE_TEXT",' +
                            '"responseXML":"RESPONSE_XML"' +
                        '}' +
                    '}' +
                '}'
            );

        });
        
    });
});