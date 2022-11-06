// SELECT ELEMENTS
const exchangeRateEl = document.querySelector('.exchange-rate');
// CONST AND LETS
const DEFAULT_BASE_CURRENCY_CODE = 'USD';
const DATA_PRECISION = 2;
let exchangeRate, currencies;

//  API PROVIDERS
const ipdata = {
    key: 'c6d0f17b893cde3c50d401ff2476f9a93ab8fc6829eae57c5f7e762a',
    baseurl: 'https://api.ipdata.co',
    currency: function(){
        return `${this.baseurl}/currency?api-key=${this.key}`
    }
}
const currencyLayer = {
    key: '816aace5f867a203d108dde0987d9681',
    baseurl: 'http://api.currencylayer.com',

    convert: function (fromCurrencyCode,toCurrencyCode,amount) {
        return `${this.baseurl}/convert?from=${fromCurrencyCode}&to=${toCurrencyCode}&amount=${amount}&access_key=${this.key}`;
    },

    list: function () {
        return `${this.baseurl}/list?&access_key=${this.key}`;
    }
}

console.log(currencyLayer.convert('USD','NGN',10))

//GET USERS CURRENCY
async function getUserCurrency(){
    const res = await fetch(ipdata.currency());
    const userCurrency = await res.json();

    return userCurrency;
}

//GET CURRENCIES
async function getCurrencyList(){
    const res = await fetch(currencyLayer.list());
    const CurrencyList = await res.json();

    return CurrencyList.currencies;
}

//GET EXCHANGE RATE
async function getExchangeRate(fromCurrencyCode, toCurrencyCode){
    const amount = 1;
    const res = await fetch(currencyLayer.convert(fromCurrencyCode, toCurrencyCode,amount));
    const data = await res.json();
   return data.result;
}
getExchangeRate('USD','NGN');

//RENDER EXCHANGE RATE
async function renderExchangeRate(fromCurrencyCode, toCurrencyCode){
    exchangeRate = await getExchangeRate(fromCurrencyCode, toCurrencyCode);
    plural = exchangeRate === 1 ? "" : "s";
    exchangeRateEl.innerHTML = `<p>1 ${currencies[fromCurrencyCode]} equals</p>
                                <h1>${exchangeRate.toFixed(DATA_PRECISION).toLocaleString('en-us')} ${currencies[toCurrencyCode]}${plural}</h1>`
}


//INITIALIzE APP
async function init(){
    const userCurrency = await getUserCurrency()
    currencies = await getCurrencyList();
    renderExchangeRate(DEFAULT_BASE_CURRENCY_CODE, userCurrency.code)
}

init();
