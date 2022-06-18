import axios from 'axios'
import {environment} from '../environment';
import { ICategory } from '../models/Category';


class CategoryService {
    
    private URL: string = environment.urlConf + '/categories';

    getCategories() {
        return axios.get(this.URL);
    }

    postCategory(category: ICategory) {
        return axios.post(this.URL, category);
    }

    patchCategory(category: ICategory, ref: string) {
        return axios.patch(this.URL + `/${ref}`, category);
    }

    deleteCategory(ref: string) {
        return axios.delete(this.URL + `/${ref}`);
    }
}

export default CategoryService;
