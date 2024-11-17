const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const CryptoJS = require("crypto-js");

const baseUrl = 'https://api.nonkyc.io/api/v2';

var nonkycApi = function(apiKey, apiSecret) {
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.signature = (requestUrl, requestBodyString, nonce) => {
    if(!requestBodyString){
        requestBodyString = "";
    }
    return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(this.apiKey+requestUrl+requestBodyString+nonce, this.apiSecret));
  }
};

module.exports.Api = function(apiKey, apiSecret) {
  return new nonkycApi(apiKey, apiSecret);
};


nonkycApi.prototype.getQuery = function(url) {

	let nonce = parseInt(Date.now());
	let apiKey = this.apiKey;
	let signature = this.signature(url.href, null, nonce);

	return new Promise((resolve, reject) => {
	
		fetch(url.href, {
			method: 'GET',
			headers : {
				'Content-Type': 'application/json',
				'X-API-KEY' : apiKey,
				'X-API-NONCE': nonce,
				'X-API-SIGN': signature
			}
		})
		.then(res => res.json())
		.then(res => {
			resolve(res);
		})
		.catch(err => {
			reject(err)
		})
        
    })
    
};

nonkycApi.prototype.deleteQuery = function(url, body) {

	let nonce = parseInt(Date.now());
	let apiKey = this.apiKey;
	let signature = this.signature(url.href, JSON.stringify(body), nonce)

	return new Promise((resolve, reject) => {
	
		fetch(url.href, {
			method: 'DELETE',
			headers : {
				'Content-Type': 'application/json',
				'X-API-KEY' : apiKey,
				'X-API-NONCE': nonce,
				'X-API-SIGN': signature
			},
			body: JSON.stringify(body)
		})
		.then(res => {
			if (res.status == 200)
			{
				resolve('OK');
			}
			else
			{
				resolve('NOTOK');
			}
		})
		.catch(err => {
			reject(err)
		})
        
    })
    
};

nonkycApi.prototype.postQuery = function(url, body) {

	let nonce = parseInt(Date.now());
	let apiKey = this.apiKey;
	let signature = this.signature(url.href, JSON.stringify(body), nonce)

	return new Promise((resolve, reject) => {
	
		fetch(url.href, {
			method: 'POST',
			headers : {
				'Content-Type': 'application/json',
				'X-API-KEY' : apiKey,
				'X-API-NONCE': nonce,
				'X-API-SIGN': signature
			},
			body: JSON.stringify(body)
		})
		.then(res => {
			if (res.status == 200)
				resolve(res.text());
			else
				reject(res);
		})
		.catch(err => {
			reject(err)
		})
        
    })
    
};


// Public Get

nonkycApi.prototype.assetGetList = function() {
    let url = new URL(baseUrl+'/asset/getlist');
    return this.getQuery(url);
}

nonkycApi.prototype.assetGetById = function(assetId) {
    let url = new URL(baseUrl+'/asset/getbyid/'+assetId);
    return this.getQuery(url);
}

nonkycApi.prototype.assetGetByTicker = function(ticker) {
    let url = new URL(baseUrl+'/asset/getbyticker/'+ticker);
    return this.getQuery(url);
}

nonkycApi.prototype.marketGetList = function() {
    let url = new URL(baseUrl+'/market/getlist');
    return this.getQuery(url);
}

nonkycApi.prototype.marketGetById = function(marketId) {
    let url = new URL(baseUrl+'/market/getbyid/'+marketId);
    return this.getQuery(url);
}

nonkycApi.prototype.marketGetBySymbol = function(symbol) {
    let url = new URL(baseUrl+'/market/getbysymbol/'+symbol);
    return this.getQuery(url);
}

nonkycApi.prototype.poolGetList = function() {
    let url = new URL(baseUrl+'/pool/getlist');
    return this.getQuery(url);
}

nonkycApi.prototype.poolGetById = function(poolId) {
    let url = new URL(baseUrl+'/pool/getbyid/'+poolId);
    return this.getQuery(url);
}

nonkycApi.prototype.poolGetBySymbol = function(symbol) {
    let url = new URL(baseUrl+'/pool/getbysymbol/'+symbol);
    return this.getQuery(url);
}

nonkycApi.prototype.marketOrderBookBySymbol = function(symbol) {
    let url = new URL(baseUrl+'/market/getorderbookbysymbol/'+symbol);
    return this.getQuery(url);
}

nonkycApi.prototype.marketOrderBookByMarketId = function(marketId) {
    let url = new URL(baseUrl+'/market/getorderbookbymarketid/'+marketId);
    return this.getQuery(url);
}

// Nomics Datafeed Format

nonkycApi.prototype.getInfo = function() {
    let url = new URL(baseUrl+'/info');
    return this.getQuery(url);
}

nonkycApi.prototype.getMarkets = function() {
    let url = new URL(baseUrl+'/markets');
    return this.getQuery(url);
}

nonkycApi.prototype.getTrades = function(marketId, since = null) {
    let url = new URL(baseUrl+'/trades');
    let params = {
        market:marketId,
        since:since,
    };
    url.search = new URLSearchParams(params).toString();
    return this.getQuery(url);
}

nonkycApi.prototype.getOrdersSnapshot = function(marketId) {
    let url = new URL(baseUrl+'/orders/snapshot');
    let params = {
        market:marketId,
    };
    url.search = new URLSearchParams(params).toString();
    return this.getQuery(url);
}

// CoinGecko Datafeed Format

nonkycApi.prototype.getPairs = function() {
    let url = new URL(baseUrl+'/pairs');
    return this.getQuery(url);
}

nonkycApi.prototype.getTickers = function() {
    let url = new URL(baseUrl+'/tickers');
    return this.getQuery(url);
}

nonkycApi.prototype.getOrderBook = function(tickerId, depth = 100) {
    let url = new URL(baseUrl+'/orderbook');
    let params = {
        ticker_id:tickerId,
        depth:depth
    };
    url.search = new URLSearchParams(params).toString();
    return this.getQuery(url);
}

nonkycApi.prototype.getHistoricalSpotTrades = function(tickerId, limit = 100) {
    let url = new URL(baseUrl+'/historical_trades');
    let params = {
        ticker_id:tickerId,
        limit:limit
    };
    url.search = new URLSearchParams(params).toString();
    return this.getQuery(url);
}

nonkycApi.prototype.getHistoricalPoolTrades = function(tickerId, limit = 100) {
    let url = new URL(baseUrl+'/historical_pooltrades');
    let params = {
        ticker_id:tickerId,
        limit:limit
    };
    url.search = new URLSearchParams(params).toString();
    return this.getQuery(url);
}

// Account

nonkycApi.prototype.balances = function() {
    let url = new URL(baseUrl+'/balances');
    return this.getQuery(url);
}

nonkycApi.prototype.createOrder = function(symbol, side, quantity, price, type = 'limit', userProvidedId = null, strictValidate = false) {
    let url = new URL(baseUrl+'/createorder');
    let body = {
	  "userProvidedId": userProvidedId,
	  "symbol": symbol,
	  "side": side,
	  "type": type,
	  "quantity": quantity,
	  "price": price,
	  "strictValidate": strictValidate,
	};
    return this.postQuery(url, body);
}

nonkycApi.prototype.cancelOrder = function(orderId) {
    let url = new URL(baseUrl+'/cancelorder');
    let body = {
        "id": orderId,
    };
    return this.postQuery(url, body);
}

nonkycApi.prototype.cancelAllOrders = function(symbol, side = 'all') {
    let url = new URL(baseUrl+'/cancelallorders');
    let body = {
        "symbol": symbol,
        "side": side,
    };
    return this.postQuery(url, body);
}

nonkycApi.prototype.getMyOrders = function(symbol = null, status = 'active', limit = 100, skip = 0) {
    let url = new URL(this.baseUrl+'/getorders');
    let params = {
        symbol:symbol,
        status:status,
        limit:limit,
        skip:skip,
    };
    url.search = new URLSearchParams(params).toString();
	return this.getQuery(url);
}

nonkycApi.prototype.getMyTrades = function(symbol = null, limit = 100, skip = 0) {
    let url = new URL(this.baseUrl+'/gettrades');
    let params = {
        symbol:symbol,
        limit:limit,
        skip:skip,
    };
    url.search = new URLSearchParams(params).toString();
	return this.getQuery(url);
}

nonkycApi.prototype.getMyTradesSince = function(symbol = null, since = 0, limit = 100, skip = 0) {
    let url = new URL(this.baseUrl+'/gettradessince');
    let params = {
        symbol:symbol,
        since:since,
        limit:limit,
        skip:skip,
    };
    url.search = new URLSearchParams(params).toString();
	return this.getQuery(url);
}

nonkycApi.prototype.getMyPoolTrades = function(symbol = null, limit = 100, skip = 0) {
    let url = new URL(this.baseUrl+'/getpooltrades');
    let params = {
        symbol:symbol,
        limit:limit,
        skip:skip,
    };
    url.search = new URLSearchParams(params).toString();
	return this.getQuery(url);
}

nonkycApi.prototype.getMyPoolTradesSince = function(symbol = null, since = 0, limit = 100, skip = 0) {
    let url = new URL(this.baseUrl+'/getpooltradessince');
    let params = {
        symbol:symbol,
        since:since,
        limit:limit,
        skip:skip,
    };
    url.search = new URLSearchParams(params).toString();
	return this.getQuery(url);
}
