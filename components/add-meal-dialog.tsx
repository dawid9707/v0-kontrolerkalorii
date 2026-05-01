'use client'

import { useState } from 'react'
import { useDiet } from '@/lib/diet-context'
import type { MealType, Product } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Check } from 'lucide-react'

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealType: MealType
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: 'Śniadanie',
  lunch: 'Obiad',
  dinner: 'Kolacja',
  snack: 'Przekąska',
}

export function AddMealDialog({ open, onOpenChange, mealType }: AddMealDialogProps) {
  const { products, addMealEntry, selectedDate } = useDiet()
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = () => {
    if (!selectedProduct || !quantity) return

    addMealEntry({
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: parseFloat(quantity),
      mealType,
      date: selectedDate,
    })

    setSelectedProduct(null)
    setQuantity('')
    setSearch('')
    onOpenChange(false)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setQuantity(product.serving.toString())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj do: {mealTypeLabels[mealType]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedProduct ? (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj produktu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[300px]">
                <div className="space-y-1">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.serving}{product.unit} • {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{product.calories} kcal</p>
                          <p className="text-xs text-muted-foreground">
                            B: {product.protein}g W: {product.carbs}g T: {product.fat}g
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedProduct.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Zmień
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Ilość ({selectedProduct.unit})
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`np. ${selectedProduct.serving}`}
                />
              </div>

              {quantity && (
                <div className="p-3 rounded-lg bg-muted text-sm">
                  <p className="font-medium mb-1">Wartości odżywcze:</p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-muted-foreground text-xs">Kalorie</p>
                      <p className="font-bold">
                        {Math.round((selectedProduct.calories * parseFloat(quantity || '0')) / selectedProduct.serving)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Białko</p>
                      <p className="font-bold text-protein">
                        {Math.round((selectedProduct.protein * parseFloat(quantity || '0')) / selectedProduct.serving)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Węgle</p>
                      <p className="font-bold text-carbs">
                        {Math.round((selectedProduct.carbs * parseFloat(quantity || '0')) / selectedProduct.serving)}g
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Tłuszcze</p>
                      <p className="font-bold text-fat">
                        {Math.round((selectedProduct.fat * parseFloat(quantity || '0')) / selectedProduct.serving)}g
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button onClick={handleAdd} className="w-full" disabled={!quantity}>
                <Check className="h-4 w-4 mr-2" />
                Dodaj posiłek
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
