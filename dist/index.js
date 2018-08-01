"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./stringExtensions");
const AllegroConnector_1 = require("./controllers/AllegroConnector");
const DBConnector_1 = require("./controllers/DBConnector");
let allegro_connector = new AllegroConnector_1.AllegroConnector();
let db_connector = new DBConnector_1.DBConnector();
// allegro_connector.getSingleAuctionPayment()
allegro_connector.getAuctionPayments().then(res => {
    let insertQuery = 'insert into konradd.allegro_payments_rest (name,date,auction_id,cost) values ';
    res.forEach(payment => {
        insertQuery += ` ('${payment.name}','${payment.date}','${payment.auction_id}','${payment.cost}'),`;
    });
    db_connector.startQuery(insertQuery.removeLast()).then(res => {
        console.log("gotowe");
    }).catch(err => {
        throw new Error(err);
    });
}).catch(err => {
    console.log(err);
});
//# sourceMappingURL=index.js.map