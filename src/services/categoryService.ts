
import { STORES, add, getAll, get, update, remove } from '@/lib/database';
import { Category } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categories = await getAll<Category>(STORES.CATEGORIES);
    return categories;
  } catch (error) {
    console.error('Error getting all categories:', error);
    throw error;
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const category = await get<Category>(STORES.CATEGORIES, id);
    return category;
  } catch (error) {
    console.error(`Error getting category with ID ${id}:`, error);
    throw error;
  }
};

// Create a new category
export const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  try {
    const now = new Date().toISOString();
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Category>(STORES.CATEGORIES, newCategory);
    return result;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Update a category
export const updateCategory = async (category: Category): Promise<Category> => {
  try {
    category.updated_at = new Date().toISOString();
    const result = await update<Category>(STORES.CATEGORIES, category);
    return result;
  } catch (error) {
    console.error(`Error updating category ${category.id}:`, error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await remove(STORES.CATEGORIES, id);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

// Get categories hierarchy
export const getCategoriesHierarchy = async (): Promise<Category[]> => {
  try {
    const categories = await getAllCategories();
    const rootCategories = categories.filter(cat => !cat.parent_id);
    
    // Build hierarchy (for future implementation)
    return rootCategories;
  } catch (error) {
    console.error('Error getting categories hierarchy:', error);
    throw error;
  }
};
