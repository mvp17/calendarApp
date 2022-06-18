import { Request, Response } from 'express';
import Category, { ICategory } from '../models/categories';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories: ICategory[] = await Category.find();
        res.status(200).json(categories);
    } 
    catch(error: any) {
        console.log(error)
        res.status(400).json({ message: error });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const newCategory: ICategory = new Category({
            name: req.body.name
        });

        await newCategory.save();
        res.status(201).json({ status: "Category Created" });
    }
    catch(error: any) {
        console.log(error)
        res.status(400).json({ message: error });
    }
};

export const updateCategory =async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndUpdate(id, {$set: req.body}, {new: true});
        res.status(201).json({ status: "Category Updated" });
    } catch(error: any) {
        console.log(error)
        res.status(400).json({ message: error });
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await Category.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: "Category Deleted" });
    } 
    catch(error: any) {
        console.log(error)
        res.status(400).json({ message: error });
    }
}