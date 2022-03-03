import express from "express" ;
const router = express.Router() ;

import ChatController from "../controllers/chatController.js" ;

router.get("/", ChatController.getChat) ;
router.post("/", ChatController.sendMessage) ;

export default router ;