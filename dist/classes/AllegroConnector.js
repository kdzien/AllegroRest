"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_js_1 = require("../config/config.js");
const DBConnector_1 = require("./DBConnector");
const got = require('got');
class AllegroConnector {
    constructor() {
        this.dbconnector = new DBConnector_1.DBConnector();
    }
    getActive() {
        let _this = this;
        got.get('https://api.allegro.pl/offers/listing?seller.id=9578341&limit=100&sort=+endTime', config_js_1.ALLEGRO_CONFIG).then(response => {
            let items = JSON.parse(response.body);
            let totalCount = Math.floor(items.searchMeta.totalCount / 100);
            let activePackages = [];
            for (let i = 0; i <= totalCount; i++) {
                let offset = i === 0 ? 0 : i + '00';
                activePackages.push(new Promise((resolve, reject) => {
                    got.get(`https://api.allegro.pl/offers/listing?seller.id=9578341&limit=100&offset=${offset}&sort=+endTime`, config_js_1.ALLEGRO_CONFIG).then(response => {
                        let partialItems = JSON.parse(response.body);
                        resolve(partialItems.items.regular);
                    }).catch(err => {
                        reject(err);
                    });
                }));
            }
            Promise.all(activePackages)
                .then(function (resp) {
                let i = 0;
                let insertQuery = 'insert into konradd.allegro_active_rest (auction_id,title,cena,sprzedaz,dostepnych,kategoria) values ';
                resp.forEach(limitSet => {
                    limitSet.forEach(auction => {
                        console.log(auction);
                        insertQuery += `('${auction.id}', "${auction.name}", '${auction.sellingMode.price.amount}',${auction.sellingMode.popularity} ,${auction.stock.available} , '${auction.category.id}'),`;
                    });
                });
                _this.dbconnector.insertRows(insertQuery.substring(0, insertQuery.length - 1));
            }).catch(err => {
                throw new Error(err);
            });
        }).catch(error => {
            throw new Error(err);
        });
    }
}
exports.AllegroConnector = AllegroConnector;
//# sourceMappingURL=AllegroConnector.js.map