import { alova } from "../request";

const VITE_CATEGORY_BASE_URL = "/category"

export const CategoryAPI = {
  getCategories() {
    return alova.Get<Api.VibeCoding.Category[]>(`${VITE_CATEGORY_BASE_URL}`);
  },
};
