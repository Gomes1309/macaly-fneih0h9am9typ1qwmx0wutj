'use client'

import React, { useState } from 'react'
import { Check, ChevronsUpDown, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Client {
  value: string
  label: string
  cnpj: string
  status: 'ativo' | 'inativo'
}

const clients: Client[] = [
  {
    value: "abc-comercio",
    label: "ABC Comércio Ltda",
    cnpj: "12.345.678/0001-90",
    status: "ativo"
  },
  {
    value: "xyz-industria",
    label: "XYZ Indústria S.A.",
    cnpj: "98.765.432/0001-10",
    status: "ativo"
  },
  {
    value: "def-servicos",
    label: "DEF Serviços ME",
    cnpj: "11.222.333/0001-44",
    status: "ativo"
  },
  {
    value: "ghi-consultoria",
    label: "GHI Consultoria Ltda",
    cnpj: "55.666.777/0001-88",
    status: "inativo"
  },
]

interface ClientSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
}

export function ClientSelector({ value, onValueChange, placeholder = "Selecionar cliente..." }: ClientSelectorProps) {
  const [open, setOpen] = useState(false)

  console.log('Client selector rendered, current value:', value)

  const selectedClient = clients.find((client) => client.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedClient ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span>{selectedClient.label}</span>
                <span className="text-xs text-muted-foreground">{selectedClient.cnpj}</span>
              </div>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente ou CNPJ..." />
          <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
          <CommandGroup>
            {clients.map((client) => (
              <CommandItem
                key={client.value}
                value={client.value}
                onSelect={(currentValue) => {
                  console.log('Client selected:', currentValue)
                  onValueChange?.(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === client.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2 flex-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-medium">{client.label}</span>
                    <span className="text-xs text-muted-foreground">{client.cnpj}</span>
                  </div>
                  <div className={cn(
                    "ml-auto px-2 py-1 rounded-full text-xs",
                    client.status === 'ativo' 
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
                  )}>
                    {client.status}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}