'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Eye, 
  EyeOff,
  UserCheck,
  UserX,
  Settings,
  Mail,
  Phone,
  Calendar,
  Clock,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

// Tipos de usuários e permissões
const tiposUsuario = [
  { value: 'admin', label: 'Administrador', color: 'bg-red-100 text-red-800', permissions: ['all'] },
  { value: 'contador', label: 'Contador', color: 'bg-blue-100 text-blue-800', permissions: ['documentos', 'clientes', 'obrigacoes', 'impostos', 'honorarios'] },
  { value: 'assistente', label: 'Assistente', color: 'bg-green-100 text-green-800', permissions: ['documentos', 'clientes', 'obrigacoes'] },
  { value: 'estagiario', label: 'Estagiário', color: 'bg-gray-100 text-gray-800', permissions: ['documentos'] },
  { value: 'cliente', label: 'Cliente', color: 'bg-purple-100 text-purple-800', permissions: ['cliente-area'] }
]

const permissoes = [
  { id: 'documentos', name: 'Documentos', description: 'Acesso aos documentos dos clientes' },
  { id: 'clientes', name: 'Clientes', description: 'Gestão de cadastro de clientes' },
  { id: 'obrigacoes', name: 'Obrigações', description: 'Controle de obrigações fiscais' },
  { id: 'impostos', name: 'Impostos', description: 'Gestão de impostos e guias' },
  { id: 'honorarios', name: 'Honorários', description: 'Controle de honorários' },
  { id: 'whatsapp', name: 'WhatsApp', description: 'Sistema de atendimento' },
  { id: 'configuracoes', name: 'Configurações', description: 'Configurações do sistema' },
  { id: 'usuarios', name: 'Usuários', description: 'Gestão de usuários' },
  { id: 'relatorios', name: 'Relatórios', description: 'Acesso aos relatórios' }
]

export default function UsuariosPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@agassessoriaonline.com.br',
      telefone: '(11) 99999-1111',
      tipo: 'admin',
      status: 'ativo',
      ultimoAcesso: '2024-06-19 10:30',
      criadoEm: '2024-01-15',
      permissoes: ['all'],
      avatar: ''
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@agassessoriaonline.com.br',
      telefone: '(11) 99999-2222',
      tipo: 'contador',
      status: 'ativo',
      ultimoAcesso: '2024-06-19 09:15',
      criadoEm: '2024-02-01',
      permissoes: ['documentos', 'clientes', 'obrigacoes', 'impostos'],
      avatar: ''
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@agassessoriaonline.com.br',
      telefone: '(11) 99999-3333',
      tipo: 'assistente',
      status: 'ativo',
      ultimoAcesso: '2024-06-18 16:45',
      criadoEm: '2024-03-10',
      permissoes: ['documentos', 'clientes'],
      avatar: ''
    },
    {
      id: 4,
      nome: 'Ana Oliveira',
      email: 'ana@agassessoriaonline.com.br',
      telefone: '(11) 99999-4444',
      tipo: 'estagiario',
      status: 'inativo',
      ultimoAcesso: '2024-06-15 14:20',
      criadoEm: '2024-04-05',
      permissoes: ['documentos'],
      avatar: ''
    }
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipo: 'assistente',
    senha: '',
    confirmarSenha: '',
    permissoes: [] as string[],
    observacoes: ''
  })

  console.log('Usuarios page rendered')

  const getTipoInfo = (tipo: string) => {
    return tiposUsuario.find(t => t.value === tipo) || tiposUsuario[0]
  }

  const getStatusBadge = (status: string) => {
    return status === 'ativo' ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">
        <UserX className="h-3 w-3 mr-1" />
        Inativo
      </Badge>
    )
  }

  const handleCreateUser = () => {
    console.log('Criando usuário:', novoUsuario)
    
    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.senha) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (novoUsuario.senha !== novoUsuario.confirmarSenha) {
      alert('As senhas não coincidem')
      return
    }

    const newUser = {
      id: usuarios.length + 1,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      telefone: novoUsuario.telefone,
      tipo: novoUsuario.tipo,
      status: 'ativo',
      ultimoAcesso: '-',
      criadoEm: new Date().toISOString().split('T')[0],
      permissoes: novoUsuario.permissoes,
      avatar: ''
    }

    setUsuarios(prev => [...prev, newUser])
    resetForm()
    setDialogOpen(false)
    alert('Usuário criado com sucesso!')
  }

  const handleEditUser = (user: any) => {
    console.log('Editando usuário:', user)
    setSelectedUser(user)
    setNovoUsuario({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      tipo: user.tipo,
      senha: '',
      confirmarSenha: '',
      permissoes: user.permissoes,
      observacoes: ''
    })
    setEditMode(true)
    setDialogOpen(true)
  }

  const handleUpdateUser = () => {
    console.log('Atualizando usuário:', selectedUser?.id)
    
    setUsuarios(prev => prev.map(user => 
      user.id === selectedUser?.id ? {
        ...user,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
        tipo: novoUsuario.tipo,
        permissoes: novoUsuario.permissoes
      } : user
    ))

    resetForm()
    setDialogOpen(false)
    setEditMode(false)
    setSelectedUser(null)
    alert('Usuário atualizado com sucesso!')
  }

  const handleToggleStatus = (userId: number) => {
    console.log('Alterando status do usuário:', userId)
    setUsuarios(prev => prev.map(user => 
      user.id === userId ? {
        ...user,
        status: user.status === 'ativo' ? 'inativo' : 'ativo'
      } : user
    ))
  }

  const handleDeleteUser = (userId: number) => {
    console.log('Excluindo usuário:', userId)
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsuarios(prev => prev.filter(user => user.id !== userId))
      alert('Usuário excluído com sucesso!')
    }
  }

  const resetForm = () => {
    setNovoUsuario({
      nome: '',
      email: '',
      telefone: '',
      tipo: 'assistente',
      senha: '',
      confirmarSenha: '',
      permissoes: [],
      observacoes: ''
    })
  }

  const handlePermissionChange = (permissao: string, checked: boolean) => {
    if (checked) {
      setNovoUsuario(prev => ({
        ...prev,
        permissoes: [...prev.permissoes, permissao]
      }))
    } else {
      setNovoUsuario(prev => ({
        ...prev,
        permissoes: prev.permissoes.filter(p => p !== permissao)
      }))
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Gestão de Usuários"
          userName="João Silva"
          userRole="Administrador"
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Usuários do Sistema</h2>
              <p className="text-muted-foreground">Gerencie usuários e suas permissões</p>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    resetForm()
                    setEditMode(false)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {editMode ? 'Editar Usuário' : 'Novo Usuário'}
                  </DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="dados" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="permissoes">Permissões</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="dados" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Nome Completo *</Label>
                        <Input
                          value={novoUsuario.nome}
                          onChange={(e) => setNovoUsuario(prev => ({...prev, nome: e.target.value}))}
                          placeholder="Digite o nome completo"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>E-mail *</Label>
                        <Input
                          type="email"
                          value={novoUsuario.email}
                          onChange={(e) => setNovoUsuario(prev => ({...prev, email: e.target.value}))}
                          placeholder="usuario@agassessoriaonline.com.br"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={novoUsuario.telefone}
                          onChange={(e) => setNovoUsuario(prev => ({...prev, telefone: e.target.value}))}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipo de Usuário *</Label>
                        <Select value={novoUsuario.tipo} onValueChange={(value) => setNovoUsuario(prev => ({...prev, tipo: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposUsuario.filter(t => t.value !== 'cliente').map(tipo => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {!editMode && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Senha *</Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={novoUsuario.senha}
                              onChange={(e) => setNovoUsuario(prev => ({...prev, senha: e.target.value}))}
                              placeholder="Digite a senha"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Confirmar Senha *</Label>
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={novoUsuario.confirmarSenha}
                            onChange={(e) => setNovoUsuario(prev => ({...prev, confirmarSenha: e.target.value}))}
                            placeholder="Confirme a senha"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Observações</Label>
                      <Textarea
                        value={novoUsuario.observacoes}
                        onChange={(e) => setNovoUsuario(prev => ({...prev, observacoes: e.target.value}))}
                        placeholder="Observações sobre o usuário..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="permissoes" className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Permissões do Sistema</h4>
                        <p className="text-sm text-muted-foreground">
                          Selecione as funcionalidades que este usuário poderá acessar
                        </p>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        {permissoes.map(permissao => (
                          <div key={permissao.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Switch
                              checked={novoUsuario.permissoes.includes(permissao.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permissao.id, checked)}
                            />
                            <div>
                              <Label className="font-medium">{permissao.name}</Label>
                              <p className="text-xs text-muted-foreground">{permissao.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={editMode ? handleUpdateUser : handleCreateUser}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editMode ? 'Atualizar' : 'Criar'} Usuário
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      resetForm()
                      setDialogOpen(false)
                      setEditMode(false)
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">{usuarios.length}</p>
                    <p className="text-muted-foreground">Total Usuários</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <UserCheck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {usuarios.filter(u => u.status === 'ativo').length}
                    </p>
                    <p className="text-muted-foreground">Usuários Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {usuarios.filter(u => u.tipo === 'admin').length}
                    </p>
                    <p className="text-muted-foreground">Administradores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-bold">
                      {usuarios.filter(u => u.ultimoAcesso !== '-' && 
                        new Date(u.ultimoAcesso) > new Date(Date.now() - 24*60*60*1000)).length}
                    </p>
                    <p className="text-muted-foreground">Online Hoje</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabela de Usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Criado Em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => {
                    const tipoInfo = getTipoInfo(usuario.tipo)
                    return (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={usuario.avatar} />
                              <AvatarFallback>
                                {usuario.nome.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{usuario.nome}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-3 w-3 mr-1" />
                                {usuario.email}
                              </div>
                              {usuario.telefone && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {usuario.telefone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={tipoInfo.color}>
                            {tipoInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {usuario.ultimoAcesso === '-' ? 'Nunca' : 
                             new Date(usuario.ultimoAcesso).toLocaleString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(usuario.criadoEm).toLocaleDateString('pt-BR')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(usuario.id)}
                            >
                              {usuario.status === 'ativo' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(usuario)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(usuario.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}