import express from "express" ;
import multer from "multer";
const router = express.Router() ;

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "./uploads/avatar")
   },
   filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) ;
      const fileName = `${file.originalname}-${uniqueSuffix}` ;
      cb(null, fileName)
   }
})
const upload = multer({storage: storage}) ;

import userController from "../controllers/userController.js" ;

router.get("/getContacts", userController.getContacts) ;
router.get("/login", userController.loginUser)
router.post('/', upload.single("avatar"), userController.createDoc) ;
router.post("/addContacts", userController.addContacts) ;

router.get("/getFile", userController.getFile)
router.get("/getMatches", userController.getMatches)
router.get("/getContactsByUsername", userController.getContactsByUsername)


router.get("/demo", userController.getDemo)


export default router