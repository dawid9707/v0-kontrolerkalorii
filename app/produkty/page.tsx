'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import { useDiet } from '@/lib/diet-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Apple, Plus, Search, Check, Filter } from 'lucide-react'

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

const ProductItem = memo(function ProductItem({ 
  product 
}: { 
  product: { id: string; name: string; serving: number; unit: string; category: string; calories: number; protein: number; carbs: number; fat: number }
}) {
  return (
    <div className="p-4 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-all duration-200 active:scale-[0.99]">
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.serving}{product.unit} | {product.category}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-primary">{product.calories} kcal</p>
          <div className="flex gap-2 text-[10px] mt-0.5">
            <span className="text-protein font-medium">B{product.protein}</span>
            <span className="text-carbs font-medium">W{product.carbs}</span>
            <span className="text-fat font-medium">T{product.fat}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

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

  const filteredProducts = useMemo(() => 
    products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory
      return matchesSearch && matchesCategory
    }),
    [products, search, selectedCategory]
  )

  const uniqueCategories = useMemo(() => [...new Set(products.map((p) => p.category))], [products])

  const handleAddProduct = useCallback(() => {
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
  }, [newProduct, addProduct])

  const openDialog = useCallback(() => setDialogOpen(true), [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-primary-container">
            <Apple className="h-6 w-6 text-primary" />
          </span>
          <div>
            <h1 className="text-xl font-bold">Produkty</h1>
            <p className="text-xs text-muted-foreground">Baza produktów</p>
          </div>
        </div>

        <Button 
          onClick={openDialog}
          className="rounded-2xl h-11 px-5 elevation-2 hover:elevation-3 transition-all duration-200 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Szukaj produktu..."
            value={search}
            onChange={handleSearchChange}
            className="pl-12 h-12 rounded-2xl bg-surface-container border-0 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-12 h-12 rounded-2xl bg-surface-container border-0 p-0 justify-center">
            <Filter className="h-5 w-5" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all" className="rounded-xl">Wszystkie</SelectItem>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat} className="rounded-xl">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products list */}
      <div className="rounded-[1.75rem] bg-card elevation-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold">Lista produktów</h2>
          <span className="text-xs text-muted-foreground bg-surface-container px-3 py-1 rounded-full">
            {filteredProducts.length} produktów
          </span>
        </div>
        <ScrollArea className="h-[450px]">
          <div className="p-3 space-y-2">
            {filteredProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="text-center py-10">
                <Apple className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Nie znaleziono produktów</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                <Apple className="h-5 w-5 text-primary" />
              </span>
              <DialogTitle className="text-lg">Dodaj nowy produkt</DialogTitle>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nazwa produktu</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="np. Jabłko"
                  className="h-12 rounded-2xl bg-surface-container border-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-sm font-medium">Kalorie (kcal)</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newProduct.calories}
                    onChange={(e) => setNewProduct({ ...newProduct, calories: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein" className="text-sm font-medium">Białko (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newProduct.protein}
                    onChange={(e) => setNewProduct({ ...newProduct, protein: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs" className="text-sm font-medium">Węglowodany (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newProduct.carbs}
                    onChange={(e) => setNewProduct({ ...newProduct, carbs: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat" className="text-sm font-medium">Tłuszcze (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newProduct.fat}
                    onChange={(e) => setNewProduct({ ...newProduct, fat: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="serving" className="text-sm font-medium">Porcja</Label>
                  <Input
                    id="serving"
                    type="number"
                    value={newProduct.serving}
                    onChange={(e) => setNewProduct({ ...newProduct, serving: e.target.value })}
                    placeholder="100"
                    className="h-12 rounded-2xl bg-surface-container border-0 text-center font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">Jednostka</Label>
                  <Select
                    value={newProduct.unit}
                    onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-surface-container border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="g" className="rounded-xl">gramy (g)</SelectItem>
                      <SelectItem value="ml" className="rounded-xl">mililitry (ml)</SelectItem>
                      <SelectItem value="szt" className="rounded-xl">sztuki (szt)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Kategoria</Label>
                <Select
                  value={newProduct.category}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="h-12 rounded-2xl bg-surface-container border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-xl">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddProduct} 
                className="w-full h-12 rounded-2xl text-base font-semibold elevation-2 hover:elevation-3 transition-all duration-200 active:scale-[0.98]"
                disabled={!newProduct.name || !newProduct.calories}
              >
                <Check className="h-5 w-5 mr-2" />
                Dodaj produkt
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
