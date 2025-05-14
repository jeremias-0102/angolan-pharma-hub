import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, CheckCheck, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns';
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

const DeliveryOrdersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [status, setStatus] = useState("");
  const [open, setOpen] = React.useState(false)
  const [framework, setFramework] = React.useState("");

  // Update the mock data to include order_id in order items
  const sampleData = [
    {
      id: '1',
      order: {
        id: 'order1',
        customer_name: 'João Silva',
        customer_phone: '+244 923 456 789',
        total: 12500,
        status: 'pending',
        items: [
          {
            id: 'item1',
            order_id: 'order1', // Add this field
            product_id: 'prod1',
            product_name: 'Paracetamol 500mg',
            product_image: '/images/products/paracetamol.jpg',
            quantity: 2,
            unit_price: 2500,
            total: 5000
          },
          {
            id: 'item2',
            order_id: 'order1', // Add this field
            product_id: 'prod2',
            product_name: 'Amoxicilina 250mg',
            product_image: '/images/products/amoxicilina.jpg',
            quantity: 1,
            unit_price: 7500,
            total: 7500
          }
        ]
      },
      address: 'Rua dos Remedios, nº 123, Luanda',
      delivery_date: '2024-07-15',
      notes: 'Entregar no portão principal',
      fee: 1500,
      assigned_to: 'Entregador 1'
    },
    {
      id: '2',
      order: {
        id: 'order2',
        customer_name: 'Maria José',
        customer_phone: '+244 924 789 123',
        total: 8000,
        status: 'completed',
        items: [
          {
            id: 'item3',
            order_id: 'order2', // Add this field
            product_id: 'prod3',
            product_name: 'Dipirona 500mg',
            product_image: '/images/products/dipirona.jpg',
            quantity: 3,
            unit_price: 1500,
            total: 4500
          },
          {
            id: 'item4',
            order_id: 'order2', // Add this field
            product_id: 'prod4',
            product_name: 'Vitamina C 1g',
            product_image: '/images/products/vitamina_c.jpg',
            quantity: 1,
            unit_price: 3500,
            total: 3500
          }
        ]
      },
      address: 'Avenida Marginal, nº 456, Luanda',
      delivery_date: '2024-07-14',
      notes: 'Entregar no apartamento 2B',
      fee: 1000,
      assigned_to: 'Entregador 2'
    },
    {
      id: '3',
      order: {
        id: 'order3',
        customer_name: 'Manuel Pereira',
        customer_phone: '+244 925 123 456',
        total: 15000,
        status: 'processing',
        items: [
          {
            id: 'item5',
            order_id: 'order3', // Add this field
            product_id: 'prod5',
            product_name: 'Omeprazol 20mg',
            product_image: '/images/products/omeprazol.jpg',
            quantity: 2,
            unit_price: 3000,
            total: 6000
          },
          {
            id: 'item6',
            order_id: 'order3', // Add this field
            product_id: 'prod6',
            product_name: 'Ibuprofeno 400mg',
            product_image: '/images/products/ibuprofeno.jpg',
            quantity: 3,
            unit_price: 3000,
            total: 9000
          }
        ]
      },
      address: 'Rua da Farmácia, nº 789, Luanda',
      delivery_date: '2024-07-16',
      notes: 'Entregar no escritório 3',
      fee: 2000,
      assigned_to: 'Entregador 3'
    }
  ];

  const filteredData = sampleData.filter(item => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      item.order.customer_name.toLowerCase().includes(searchTerm) ||
      item.order.customer_phone.toLowerCase().includes(searchTerm) ||
      item.address.toLowerCase().includes(searchTerm)
    );
  }).filter(item => {
    if (!date?.from || !date?.to) return true;
    const deliveryDate = new Date(item.delivery_date as string);
    return deliveryDate >= date.from && deliveryDate <= date.to;
  }).filter(item => {
    if (!status) return true;
    return item.order.status === status;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ordens de Entrega</h1>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Input
          type="text"
          placeholder="Pesquisar por nome, telefone ou endereço..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <DateRangePicker date={date} onDateChange={setDate} />

        <div>
          <Select onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="processing">Em processamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Ordem</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Data de Entrega</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.order.id}</TableCell>
                <TableCell>{item.order.customer_name}</TableCell>
                <TableCell>{item.order.customer_phone}</TableCell>
                <TableCell>{item.address}</TableCell>
                <TableCell>{item.delivery_date}</TableCell>
                <TableCell>AOA {item.fee}</TableCell>
                <TableCell>
                  {item.order.status === 'pending' && <Badge variant="secondary">Pendente</Badge>}
                  {item.order.status === 'processing' && <Badge variant="outline">Em processamento</Badge>}
                  {item.order.status === 'completed' && <Badge>Concluído</Badge>}
                  {item.order.status === 'cancelled' && <Badge variant="destructive">Cancelado</Badge>}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Ver Detalhes</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Detalhes da Entrega</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="grid gap-2">
                            <div>
                              <strong>Cliente:</strong> {item.order.customer_name}
                            </div>
                            <div>
                              <strong>Telefone:</strong> {item.order.customer_phone}
                            </div>
                            <div>
                              <strong>Endereço:</strong> {item.address}
                            </div>
                            <div>
                              <strong>Data de Entrega:</strong> {item.delivery_date}
                            </div>
                            <div>
                              <strong>Taxa:</strong> AOA {item.fee}
                            </div>
                            <div>
                              <strong>Entregador:</strong> {item.assigned_to}
                            </div>
                            <div>
                              <strong>Status:</strong> {item.order.status}
                            </div>
                            <div>
                              <strong>Produtos:</strong>
                              <ul>
                                {item.order.items.map(orderItem => (
                                  <li key={orderItem.id}>
                                    {orderItem.product_name} x {orderItem.quantity}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong>Total:</strong> AOA {item.order.total}
                            </div>
                            <div>
                              <strong>Observações:</strong> {item.notes}
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeliveryOrdersPage;
