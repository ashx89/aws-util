var HttpProxyAgent = require('proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');

module.exports = {

    /**
       Factory for building HTTP agents. Used to connect to non-SSL secured endpoints via a proxy.
       @param {string} [overrideProxyUri] URI of the HTTP proxy server to use to create the agent.
       @env {string} http_proxy Default proxy URI if not overridden.
       @returns {HttpProxyAgent}
    */
    httpAgent: function onHttpAgent(overrideProxyUri) {
        var proxyUri = overrideProxyUri || process.env.http_proxy;

        if (!proxyUri) {
            return null;
        }

        var agent = new HttpProxyAgent(proxyUri);

        return agent;
    },

     /**
       Factory for building HTTPS agents. Used to connect to SSL secured endpoints via a proxy.
       @param {string} [overrideProxyUri] URI of the HTTPS proxy server to use to create the agent.
       @env {string} https_proxy Default proxy URI if not overridden.
       @returns {HttpsProxyAgent}
    */
    httpsAgent: function onHttpsAgent(overrideProxyUri) {
        var proxyUri = overrideProxyUri || process.env.https_proxy;

        if (!proxyUri) {
            return null;
        }

        var agent = new HttpsProxyAgent(proxyUri);

        return agent;
    }
};
