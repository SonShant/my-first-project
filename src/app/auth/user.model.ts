export class User{
    constructor(
        public email: string, 
        public id:string, 
        private _token:string, 
        private _tokenExpressionDate:Date){}

    get token(){ //this is a getter looks like function 
        if(!this._tokenExpressionDate || new Date() > this._tokenExpressionDate){
            return null;
        }
        return this._token;
    }
}