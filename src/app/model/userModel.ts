export default class User{
    username:string | undefined;
    email:string | undefined;
    password:string | undefined;
    constructor(userName?:string,password?:string,email?:string){
        this.username=userName
        this.password=password;
        this.email=email;
    }
}