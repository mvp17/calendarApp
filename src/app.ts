import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import CategoriesRoutes from './routes/categories';

const app: Application = express();

// settings
app.set('port', 4000);

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// routes
app.use('/calendar/categories', CategoriesRoutes);

export default app;