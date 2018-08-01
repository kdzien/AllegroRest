declare function require(name:string);
import "./stringExtensions"
import { AllegroConnector } from './controllers/AllegroConnector';
import { DBConnector } from './controllers/DBConnector';

let allegro_connector = new AllegroConnector();
let db_connector = new DBConnector();


// allegro_connector.getSingleAuctionPayment()
allegro_connector.getAuctionPayments().then(res=>{
    let insertQuery = 'insert into konradd.allegro_payments_rest (name,date,auction_id,cost) values '
    res.forEach(payment => {
        insertQuery += ` ('${payment.name}','${payment.date}','${payment.auction_id}','${payment.cost}'),`
    })
    db_connector.startQuery(insertQuery.removeLast()).then(res=>{
        console.log("gotowe");
    }).catch(err=>{
        throw new Error(err);
    })
}).catch(err=>{
    console.log(err)
})