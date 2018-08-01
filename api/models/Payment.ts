export class Payment{
    name: string;
    date: string;
    auction_id: string;
    cost: string;
    constructor(name: string,date:string,auction_id:string,cost:string){
        this.name=name;
        this.date=date;
        this.auction_id=auction_id;
        this.cost=cost;
    }
}

