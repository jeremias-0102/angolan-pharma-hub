
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, UserRole } from '@/types/models';
import FileUpload from '@/components/ui/file-upload';
import { getBase64 } from '@/lib/image-utils';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

// Form schema validation
const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" })
    .optional()
    .or(z.literal('')),
  role: z.enum(["admin", "pharmacist", "delivery", "client", "supervisor"], {
    message: "Selecione um cargo válido"
  }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '', // Campo vazio por padrão
      role: user?.role || 'client',
      phone: user?.phone || '',
    },
  });

  const handleFileChange = async (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      try {
        const base64 = await getBase64(file);
        setAvatarPreview(base64);
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
      }
    } else {
      setAvatarPreview('');
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      let avatarBase64 = user?.avatar || '';
      
      // Se um novo arquivo foi selecionado, converter para base64
      if (avatarFile) {
        avatarBase64 = await getBase64(avatarFile);
      }

      const userData: User = {
        id: user?.id || '',
        name: values.name,
        email: values.email,
        role: values.role,
        phone: values.phone || '',
        avatar: avatarBase64,
        created_at: user?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password: values.password || undefined,
        is_active: user?.is_active ?? true,
      };
      
      onSave(userData);
      
      // Reset form
      setAvatarFile(null);
      setAvatarPreview('');
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Utilizador' : 'Adicionar Novo Utilizador'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{user ? 'Nova Senha (deixe vazio para manter a atual)' : 'Senha'}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={user ? "••••••" : "Senha"} 
                      {...field} 
                      required={!user}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="pharmacist">Farmacêutico</SelectItem>
                      <SelectItem value="delivery">Entregador</SelectItem>
                      <SelectItem value="client">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="+244 XXX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium">Foto do Usuário</label>
              <FileUpload
                onFileChange={handleFileChange}
                initialPreview={avatarPreview}
                accept="image/*"
                maxSize={2}
                className="mt-2"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {user ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;
