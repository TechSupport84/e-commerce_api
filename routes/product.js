import express  from "express"
import { addProduct, getProducts ,updateProduct, deleteProduct, getproductById} from "../controllers/productController.js"
import upload from "../middlewares/upload.js"
const router  = express.Router()

router.post("/create",upload.single("image"),addProduct)


router.get("/products",getProducts)
router.get("/:id",getproductById)
router.put("/update/:id",upload.single("image"),updateProduct)
router.delete("/delete/:id", deleteProduct)
 




export default router