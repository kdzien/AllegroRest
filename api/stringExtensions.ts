interface String {
    removeLast(): string;
}

String.prototype.removeLast = function(){
   return this.substring(0,this.length-1);
};