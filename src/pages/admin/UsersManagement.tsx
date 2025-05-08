
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  UserPlus, 
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import UserFormModal from '@/components/admin/UserFormModal';
import { User, UserRole } from '@/types/models';

// Mock data for development - will be replaced with API calls
const mockUsers: User[] = [
  { 
    id: "1", 
    name: "João Silva", 
    email: "joao.silva@example.com", 
    role: "admin", 
    phone: "+244 923 456 789", 
    avatar: "", 
    created_at: "2023-01-15T10:30:00Z", 
    updated_at: "2023-01-15T10:30:00Z",
    password: "senha123" // Adicionar senha aos usuários mock
  },
  { 
    id: "2", 
    name: "Maria Santos", 
    email: "maria.santos@example.com", 
    role: "pharmacist", 
    phone: "+244 912 345 678", 
    avatar: "", 
    created_at: "2023-02-10T14:20:00Z", 
    updated_at: "2023-02-10T14:20:00Z",
    password: "senha123"
  },
  { 
    id: "3", 
    name: "Carlos Mendes", 
    email: "carlos.mendes@example.com", 
    role: "delivery", 
    phone: "+244 934 567 890", 
    avatar: "", 
    created_at: "2023-03-05T09:15:00Z", 
    updated_at: "2023-03-05T09:15:00Z",
    password: "senha123"
  },
  { 
    id: "4", 
    name: "Ana Luísa", 
    email: "ana.luisa@example.com", 
    role: "client", 
    phone: "+244 956 789 123", 
    avatar: "", 
    created_at: "2023-04-20T16:45:00Z", 
    updated_at: "2023-04-20T16:45:00Z",
    password: "senha123"
  },
  { 
    id: "5", 
    name: "Pedro Costa", 
    email: "pedro.costa@example.com", 
    role: "pharmacist", 
    phone: "+244 945 678 912", 
    avatar: "", 
    created_at: "2023-05-11T11:10:00Z", 
    updated_at: "2023-05-11T11:10:00Z",
    password: "senha123"
  }
];

// Function to translate role to Portuguese
const translateRole = (role: UserRole): string => {
  const translations: Record<UserRole, string> = {
    admin: "Administrador",
    pharmacist: "Farmacêutico",
    delivery: "Entregador",
    client: "Cliente"
  };
  
  return translations[role] || role;
};

const UsersManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter users based on search term
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm) {
        const filtered = users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          translateRole(user.role).toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, users]);

  // Sort users based on field
  const handleSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortField === field) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(direction);
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    
    const sortedUsers = [...filteredUsers].sort((a: any, b: any) => {
      if (direction === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    
    setFilteredUsers(sortedUsers);
  };

  const handleOpenCreateModal = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = (user: User) => {
    if (currentUser) {
      // Update existing user
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          // Se a senha estiver em branco, mantenha a senha atual
          return {
            ...user,
            password: user.password || u.password
          };
        }
        return u;
      });
      setUsers(updatedUsers);
      toast({
        title: "Utilizador atualizado",
        description: `${user.name} foi atualizado com sucesso`,
      });
    } else {
      // Add new user with a generated ID
      const newUser = {
        ...user,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password: user.password || 'senha123' // Senha padrão se não for fornecida
      };
      setUsers([...users, newUser]);
      toast({
        title: "Utilizador criado",
        description: `${newUser.name} foi adicionado com sucesso`,
      });
    }
    handleCloseModal();
  };

  const confirmDeleteUser = (user: User) => {
    setUserToDelete(user);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      toast({
        title: "Utilizador removido",
        description: `${userToDelete.name} foi removido com sucesso`,
        variant: "destructive"
      });
      setUserToDelete(null);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="inline h-4 w-4 ml-1" /> : <ArrowDown className="inline h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
        <Button onClick={handleOpenCreateModal}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Utilizador
        </Button>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Pesquisar por nome, email ou cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort('name')}>
                Nome {getSortIcon('name')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('role')}>
                Cargo {getSortIcon('role')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                Data de Registo {getSortIcon('created_at')}
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{translateRole(user.role)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString('pt-AO')}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  Nenhum utilizador encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <UserFormModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSaveUser}
          user={currentUser}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar o utilizador {userToDelete?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersManagement;
