'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp } from 'lucide-react'

const monthlyData = [
  { month: 'Jan', pendentes: 8, entregues: 45, atrasadas: 2 },
  { month: 'Fev', pendentes: 12, entregues: 52, atrasadas: 1 },
  { month: 'Mar', pendentes: 6, entregues: 48, atrasadas: 3 },
  { month: 'Abr', pendentes: 15, entregues: 41, atrasadas: 4 },
  { month: 'Mai', pendentes: 9, entregues: 56, atrasadas: 1 },
  { month: 'Jun', pendentes: 12, entregues: 49, atrasadas: 2 }
]

const statusData = [
  { name: 'Entregues', value: 291, color: 'hsl(var(--chart-2))' },
  { name: 'Pendentes', value: 62, color: 'hsl(var(--chart-4))' },
  { name: 'Atrasadas', value: 13, color: 'hsl(var(--chart-3))' }
]

export function ObligationsChart() {
  console.log('Obligations chart component rendered')

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Monthly Obligations Bar Chart */}
      <Card className="ag-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Obrigações por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="entregues" 
                name="Entregues"
                fill="hsl(var(--chart-2))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="pendentes" 
                name="Pendentes"
                fill="hsl(var(--chart-4))" 
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="atrasadas" 
                name="Atrasadas"
                fill="hsl(var(--chart-3))" 
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Chart */}
      <Card className="ag-card">
        <CardHeader>
          <CardTitle>Status das Obrigações</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center space-x-4 mt-4">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}