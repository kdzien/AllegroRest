export class Auction{
    id: string;
    name: string;
    price: string;
    sold: number;
    available: number;
    category: string;
    constructor(id: string,name:string,price:string,sold:number,available:number,category:string){
        this.id=id;
        this.name=name;
        this.price=price;
        this.sold=sold;
        this.available=available;
        this.category=category;
    }
}

