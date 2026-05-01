'use client'

import { useState } from 'react'
import { useDiet } from '@/lib/diet-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Apple, Plus, Search } from 'lucide-react'

const categories = [
  'Nabiał',
  'Mięso',
  'Ryby',
  'Węglowodany',
  'Warzywa',
  'Owoce',
  'Orzechy',
  'Napoje',
  'Inne',
]

export default function ProductsPage() {
  const { products, addProduct } = useDiet()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    serving: '100',
    unit: 'g',
    category: 'Inne',
  })

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.calories) return

    addProduct({
      name: newProduct.name,
      calories: parseFloat(newProduct.calories),
      protein: parseFloat(newProduct.protein) || 0,
      carbs: parseFloat(newProduct.carbs) || 0,
      fat: parseFloat(newProduct.fat) || 0,
      serving: parseFloat(newProduct.serving) || 100,
      unit: newProduct.unit,
      category: newProduct.category,
    })

    setNewProduct({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      serving: '100',
      unit: 'g',
      category: 'Inne',
    })
    setDialogOpen(false)
  }

  const uniqueCategories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Apple className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Baza produktów</h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dodaj nowy produkt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nazwa produktu</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="np. Jabłko"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Kalorie (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newProduct.calories}
                    onChange={(e) => setNewProduct({ ...newProduct, calories: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Białko (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newProduct.protein}
                    onChange={(e) => setNewProduct({ ...newProduct, protein: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Węglowodany (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newProduct.carbs}
                    onChange={(e) => setNewProduct({ ...newProduct, carbs: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Tłuszcze (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newProduct.fat}
                    onChange={(e) => setNewProduct({ ...newProduct, fat: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serving">Porcja</Label>
                  <Input
                    id="serving"
                    type="number"
                    value={newProduct.serving}
                    onChange={(e) => setNewProduct({ ...newProduct, serving: e.target.value })}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Jednostka</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">gramy (g)</SelectItem>
                      <SelectItem value="ml">mililitry (ml)</SelectItem>
                      <SelectItem value="szt">sztuki (szt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategoria</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddProduct} className="w-full">
                Dodaj produkt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj produktu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products list */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            {filteredProducts.length} produktów
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.serving}{product.unit} • {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{product.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        B: {product.protein}g W: {product.carbs}g T: {product.fat}g
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
