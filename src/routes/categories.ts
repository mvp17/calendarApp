import { Router } from 'express';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../controllers/categories.controller';

const router = Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id", updateCategory)

export default router;