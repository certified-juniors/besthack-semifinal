const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = require('../config').apikey;
const finnhubClient = new finnhub.DefaultApi();
const fs = require('fs');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class StockController {
    dev = true;
    INTERVAL = 3000;
    CARDS_ON_PAGE = 10;
    constructor() {
        this.counter = 1;
        this.timestampFirstRequest = new Date();
        this.activeStocks = "TSLA, NVDA, WU, TWTR, BABA, AMD, CCL, FB, DAL, NKE, IBM, OXY, VIPS, BIDU, LVS, AAPL, PYPL, AMZN, BZUN, MOMO, OSUR, BA, ESPR, BYSI, MSFT, COIN, MARA, CVX, TSM, WFC, OIS, SPCE, AA, MRNA, BILI, MOS, IOVA, XOM, NEM, EQT, JD, GOOG, C, AAL, HAL, TCS, GOOGL, INTC, MS, M, CLF, GS, GTHX, TSN, TGT, CNK, RIVN, MU, UAL, TWOU, BAC, SQ, BBBY, ARMK, QCOM, F, ABBV, EHTH, ENDP, ZIM, NVTA, SPR, SWN, CAT, TAL, MSTR, EAR, RIG, RCL, HTHT, AFL, ASTR, DXC, NFLX, PFE, SAVA, FDX, LI, ETSY, CHGG, ARVL, APLE, SFM, WISH, CGEN, V, AYX, SAVE, FTCI, ATRA".split(", ");
        // this.getStocksFromFinnhub(this.activeStocks.slice(0, this.CARDS_ON_PAGE)).then((neededStocks) => {
        //     console.log(neededStocks);
        // });
        this.data = fs.readFileSync('./data.json');
    }

    async cycleGetter() {
        const curSymbol = this.activeStocks[0];
        const stock = await this.getStockFromFinnhub(curSymbol);
        this.data[stock.symbol] = stock;
        this.data.timestamp = new Date().getTime();
        this.activeStocks.push(this.activeStocks.shift());
        if (curSymbol === "TSLA") {
            fs.writeFileSync('./data.json', JSON.stringify(this.data));
        }
    }

    async getStocksFromFinnhub(symbols) {
        if (symbols.length > 60 - this.counter) {
            return;
        }
        return new Promise((resolve, reject) => {
            let stocks = [];
            for (let i = 0; i < symbols.length; i++) {
                let symbol = symbols[i];
                this.getStockFromFinnhub(symbol).then((stock) => {
                    stocks.push(stock);
                    if (stocks.length === symbols.length) {
                        resolve(stocks);
                    }
                }).catch((error) => {
                    reject(error)
                });
                this.counter++;
            }
        });
    }

    async getStockFromFinnhub(symbol) {
        return new Promise((resolve, reject) => {
            finnhubClient.quote(symbol, (error, data, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        symbol,
                        ...data,
                    });
                }
            });
        });
    }

    async getDataForGraph(symbol) {
        return new Promise((resolve, reject) => {
            finnhubClient.stockCandles(symbol, '1', (error, data, response) => {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    }

    getActiveStocksFromFinnhub() {
        return new Promise((resolve, reject) => {
            finnhubClient.stockSymbols('US', { 'currency': 'USD' }, (error, data, response) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                let activeStocks = [];
                console.log("ЗАГРУЖАЕТСЯ", data.length, "АКЦИЙ");
                for (let i = 0; i < data.length; i++) {
                    activeStocks.push(data[i].symbol);
                }
                resolve(activeStocks);
            });
        });
    }

    canUpdate() {
        return this.updateMinute() && this.counter < 60;
    }

    updateMinute() {
        const now = new Date();
        if (now - 60000 > this.timestampFirstRequest) {
            this.timestampFirstRequest = now;
            this.counter = 0;
        }
        this.timestamp = new Date().getTime() - 10000;
        this.rate = this.getRate();
    }

    updateData() {
        // Проверить есть ли список всех акций
        // Если нет, то загрузить из финансового портала
    }

    // На страницах обновляется Дата и время последнего обновления данных, Последняя цена акции, Необходимые данные для графиков.
    getData(page) {
        return {
            date: "2020-04-17 20:30:00",
            stocks: [
                {
                    symbol: "YNDX",
                    name: "Yandex",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
                {
                    symbol: "AAPL",
                    name: "Apple",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
                {
                    symbol: "NVDA",
                    name: "Nvidia",
                    last_price: 321.5,
                    graph: [
                        {
                            timestamp: new Date().getTime() - 3*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 2*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                        {
                            timestamp: new Date().getTime() - 1*this.INTERVAL,
                            open: 170.35,
                            high: 170.40,
                            low: 170.35,
                            close: 170.40,
                        },
                    ]
                },
            ]
        }
    }

    async getRate() {
    }

    async updateRate() {
        this.rate = await getRate();
    }

    async indexPage(req, res) {
    }

    async getStock(req, res) {
        if (!this.canUpdate()) {
            return undefined;
        }
        this.timestamp = new Date().getTime();
        console.log(stock);
    }

    async downloadCSV() {
    }
}

module.exports = new StockController();