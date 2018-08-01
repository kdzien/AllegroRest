"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("../config/config.js");
const Auction_1 = require("../models/Auction");
const DBConnector_1 = require("./DBConnector");
const Payment_1 = require("../models/Payment");
const got = require('got');
const db = new DBConnector_1.DBConnector();
class AllegroConnector {
    constructor() {
    }
    getGrades() {
        return new Promise((resolve, reject) => {
            got.get(`${config_js_1.ALLEGRO_HOST}/sale/user-ratings?user.id=${config_js_1.ALLEGRO_SELLERID}&limit=20`, config_js_1.ALLEGRO_CONFIG).then(response => {
                resolve(JSON.parse(response.body));
            }).catch(err => {
                reject(err);
            });
        });
    }
    getSingleAuctionPayment() {
        got.get(`https://api.allegro.pl/pricing/offer-quotes?offer.id=6568161705`, config_js_1.ALLEGRO_CONFIG)
            .then(response => {
            let res = JSON.parse(response.body);
            console.log(res);
        })
            .catch(err => {
            console.log(err);
        });
    }
    getAuctionPayments() {
        let totalPayments = [];
        return new Promise((resolve, reject) => {
            db.startQuery('select auction_id from mariuszj.allegro order by auction_id').then(result => {
                let request_loop = Math.floor((result.length / 20) / 30);
                let request_count = 30;
                let auctions = result;
                let j = 0, k = 0;
                (function resolveRequest() {
                    if (k <= request_loop) {
                        let request_packages = [];
                        for (let i = 0; i <= request_count; i++) {
                            let start = j === 0 ? 0 : j;
                            j += 20;
                            let temp_array = auctions.slice(start, start + 20);
                            let request_string = '';
                            temp_array.forEach((elem, i) => {
                                i == 0 ?
                                    request_string += `?offer.id=${elem.auction_id}` :
                                    request_string += `&offer.id=${elem.auction_id}`;
                            });
                            if (request_string.indexOf('offer.id') !== -1) {
                                request_packages.push(new Promise((re, rj) => {
                                    got.get(`${config_js_1.ALLEGRO_HOST}/pricing/offer-quotes${request_string}`, config_js_1.ALLEGRO_CONFIG)
                                        .then(response => {
                                        let res = JSON.parse(response.body);
                                        re(res);
                                    })
                                        .catch(err => {
                                        rj(err);
                                    });
                                }));
                            }
                        }
                        Promise.all(request_packages).then(res => {
                            res.forEach(limitSet => {
                                limitSet.quotes.forEach(payment => {
                                    totalPayments.push(new Payment_1.Payment(payment.name, payment.nextDate, payment.offer.id, payment.fee.amount));
                                });
                            });
                            k++;
                            resolveRequest();
                        }).catch(err => {
                            reject(err);
                        });
                    }
                    else {
                        resolve(totalPayments);
                    }
                })();
            }).catch(err => {
                reject(err);
            });
        });
    }
    getActive() {
        return new Promise((resolve, reject) => {
            got.get(`${config_js_1.ALLEGRO_HOST}/offers/listing?seller.id=${config_js_1.ALLEGRO_SELLERID}&limit=100&sort=+endTime`, config_js_1.ALLEGRO_CONFIG).then(response => {
                let items = JSON.parse(response.body);
                let totalCount = Math.floor(items.searchMeta.totalCount / 100);
                let activePackages = [];
                for (let i = 0; i <= totalCount; i++) {
                    let offset = i === 0 ? 0 : i + '00';
                    activePackages.push(new Promise((resolve, reject) => {
                        got.get(`${config_js_1.ALLEGRO_HOST}/offers/listing?seller.id=${config_js_1.ALLEGRO_SELLERID}&limit=100&offset=${offset}&sort=+endTime`, config_js_1.ALLEGRO_CONFIG).then(response => {
                            let partialItems = JSON.parse(response.body);
                            resolve(partialItems.items.regular);
                        }).catch(err => {
                            reject(err);
                        });
                    }));
                }
                Promise.all(activePackages)
                    .then(function (resp) {
                    let all_auctions = [];
                    let i = 0;
                    resp.forEach(limitSet => {
                        limitSet.forEach(auction => {
                            all_auctions.push(new Auction_1.Auction(auction.id, auction.name, auction.sellingMode.price.amount, auction.sellingMode.popularity, auction.stock.available, auction.category.id));
                        });
                    });
                    resolve(all_auctions);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
}
exports.AllegroConnector = AllegroConnector;
//# sourceMappingURL=AllegroConnector.js.map