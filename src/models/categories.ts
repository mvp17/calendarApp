import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
};

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    }
});

export default model<ICategory>('Category', categorySchema);