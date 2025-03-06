import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Person } from "@/types/Person";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

export const Persons = () => {
  const [persons, setPersons] = useState<Person[]>([]);  

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = persons.slice(indexOfFirstItem, indexOfLastItem);
 
  useEffect(() => {
    fetchPersons();
  }, []);  

  const fetchPersons = () => {
    axios.get<Person[]>("https://localhost:7125/Persons")
      .then((response) => {
        setPersons(response.data);  
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
      });
  };

  
  const enviaForm:SubmitHandler<inputs> = ( data) => {

    axios.post("https://localhost:7125/Persons", data)
      .then((response) => {
        console.log("Pessoa adicionada com sucesso:", response.data);
        fetchPersons(); 
        reset()
      })
      .catch((error) => {
        console.error("Erro ao adicionar pessoa:", error);
      });
  };

  const handleDelete = (personId: number) => {
    axios.delete(`https://localhost:7125/Persons/${personId}`)
      .then(() => {
        
        setPersons(persons.filter((person) => person.personId !== personId));
        console.log("Pessoa removida com sucesso");
      })
      .catch((error) => {
        console.error("Erro ao remover pessoa:", error);
      });
  };

  type inputs = {
    name: string;
    age: number;
    estadoCivil: string;
    cpf: string;
    cidade: string;
    estado: string;
  };

  const { handleSubmit, register, reset, formState:{errors} } = useForm<inputs>();


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-end mb-3">
        <Dialog>
          <DialogTrigger>
            <Button variant={"outline"}>Adicionar new Person</Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-teal-800">
            <DialogHeader>
              <DialogTitle>New Person</DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={handleSubmit(enviaForm)}>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>Name</Label>
                <Input {...register("name",{required:true})} className="w-64"/>
              </div>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>Idade</Label>
                <Input {...register("age", { required: true, valueAsNumber: true })} className="w-16" type="number" />
              </div>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>Estado civil</Label>
                <Input {...register("estadoCivil",{required:true})} className="w-64" />
              </div>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>CPF</Label>
                <Input
                 {...register("cpf",{required:true, maxLength:11})}
                  className="w-64"
                  />
              </div>
              {errors.cpf && <p className=" text-red-500 text-center">Insira somente 8 digitos</p>}
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>Cidade</Label>
                <Input {...register("cidade",{required:true})} className="w-64" />
              </div>
              <div className="grid grid-cols-4 items-center text-right gap-3">
                <Label>Estado</Label>
                <Input {...register("estado",{required:true})}/>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button type="button">Cancelar</Button>
                </DialogClose>
                <DialogClose>
                  <Button type="submit" variant={"outline"}>Salvar</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black">Nome</TableHead>
              <TableHead className="text-black">Idade</TableHead>
              <TableHead className="text-black">Estado civil</TableHead>
              <TableHead className="text-black">CPF</TableHead>
              <TableHead className="text-black">Cidade</TableHead>
              <TableHead className="text-black">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((person) => (
              <TableRow key={person.personId}>  {}
                <TableCell>{person.name}</TableCell>
                <TableCell>{person.age}</TableCell>
                <TableCell>{person.estadoCivil}</TableCell>
                <TableCell>{person.cpf}</TableCell>
                <TableCell>{person.cidade}</TableCell>
                <TableCell>{person.estado}</TableCell>
                <TableCell><Button onClick={() => handleDelete(person.personId)} className="p-3 h-2" variant={"destructive"}>x</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center gap-7 mt-4 mb-4">
          <Button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1} 
            variant="outline"
          >
            Anterior
          </Button>
          <span>Página {currentPage}</span>
          <Button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage >= Math.ceil(persons.length / itemsPerPage)} 
            variant="outline"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};