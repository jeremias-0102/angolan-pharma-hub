
import { v4 as uuidv4 } from 'uuid';
import { Category } from '@/types/models';
import { add, getAll, update, get, remove, getByIndex, getNextSequenceValue, STORES } from '@/lib/database';

// Listar todas as categorias
export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await getAll<Category>(STORES.CATEGORIES);
  return categories;
};

// Obter categoria por ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  return await get<Category>(STORES.CATEGORIES, id);
};

// Criar categoria
export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  // Verifica se já existe categoria com o mesmo nome
  const existingCategories = await getByIndex<Category>(STORES.CATEGORIES, 'name', categoryData.name);
  if (existingCategories.length > 0) {
    throw new Error('Já existe uma categoria com este nome.');
  }

  // Gera ID para a categoria usando código autoincrementado
  const code = await getNextSequenceValue('category_code');
  
  const now = new Date().toISOString();
  const category: Category = {
    ...categoryData,
    id: uuidv4(),
    created_at: now,
    updated_at: now,
    is_active: categoryData.is_active !== undefined ? categoryData.is_active : true
  };

  await add(STORES.CATEGORIES, category);
  return category;
};

// Function needed for CategoryFormModal
export const addCategory = async (category: Category): Promise<Category> => {
  await add(STORES.CATEGORIES, category);
  return category;
};

// Atualizar categoria
export const updateCategory = async (category: Category): Promise<Category> => {
  const existingCategory = await get<Category>(STORES.CATEGORIES, category.id);
  if (!existingCategory) {
    throw new Error('Categoria não encontrada.');
  }

  // Verifica se está alterando o nome para um nome que já existe
  if (category.name && category.name !== existingCategory.name) {
    const existingCategories = await getByIndex<Category>(STORES.CATEGORIES, 'name', category.name);
    if (existingCategories.length > 0) {
      throw new Error('Já existe uma categoria com este nome.');
    }
  }

  await update(STORES.CATEGORIES, category);
  return category;
};

// Excluir categoria
export const deleteCategory = async (id: string): Promise<void> => {
  await remove(STORES.CATEGORIES, id);
};

// Obter categorias ativas
export const getActiveCategories = async (): Promise<Category[]> => {
  const categories = await getAll<Category>(STORES.CATEGORIES);
  return categories.filter(category => category.is_active === true);
};

// Check if category is in use by any products
export const isCategoryInUse = async (categoryId: string): Promise<boolean> => {
  // This is a simplified version - in a real app you'd check if any products use this category
  // For now, we'll just return false to allow deletion
  return false;
};
