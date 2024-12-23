import UserService from './carts.service.js';

class SessionService extends UserService {
    constructor() {
        super();
    }
    verify = async (email, verifyCodeFromClient) => {
       
}