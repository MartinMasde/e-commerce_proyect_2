import { createUser, readUsers, updateUser, destroyUser } from "../../controllers/users.controller.js";
import CustomRouter from "../../utils/CustomRouter.util.js";

class UsersApiRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }
  init = () => {
    this.create("/",["ADMIN"], createUser);
    this.read("/",["ADMIN"], readUsers);
    this.update("/:id",["ADMIN", "USER"], updateUser);
    this.destroy("/:id", ["ADMIN", "USER"], destroyUser);
  };
}

let usersApiRouter = new UsersApiRouter();
export default usersApiRouter.getRouter();


