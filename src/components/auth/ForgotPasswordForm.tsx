
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type FormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmailSent(true);
      
      toast({
        title: "Link de recuperação enviado",
        description: `Um link de recuperação foi enviado para ${values.email}`,
      });
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Verifique seu email</h2>
        <p className="text-center text-gray-600 mb-6">
          Enviamos um link para recuperar sua senha para o email informado. 
          Verifique sua caixa de entrada e pasta de spam.
        </p>
        <p className="text-center text-gray-500 text-sm mb-6">
          O link expirará em 30 minutos.
        </p>
        <div className="text-center">
          <Button 
            variant="outline" 
            type="button" 
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-center">Esqueceu a senha?</h2>
      <p className="text-center text-gray-600 mb-6">
        Insira seu email e enviaremos um link para resetar sua senha.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Recuperar senha"}
          </Button>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={onBack}
            className="w-full mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para login
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center text-sm">
        <p className="text-gray-500">
          Também enviamos um código por WhatsApp para os números cadastrados.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
