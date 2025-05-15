
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

// Atualizar categoria
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  const category = await get<Category>(STORES.CATEGORIES, id);
  if (!category) {
    throw new Error('Categoria não encontrada.');
  }

  // Verifica se está alterando o nome para um nome que já existe
  if (categoryData.name && categoryData.name !== category.name) {
    const existingCategories = await getByIndex<Category>(STORES.CATEGORIES, 'name', categoryData.name);
    if (existingCategories.length > 0) {
      throw new Error('Já existe uma categoria com este nome.');
    }
  }

  const updatedCategory = {
    ...category,
    ...categoryData,
    updated_at: new Date().toISOString()
  };

  await update(STORES.CATEGORIES, updatedCategory);
  return updatedCategory;
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
