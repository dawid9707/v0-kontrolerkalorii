'use client'

import { useState, useCallback, useMemo, memo } from 'react'
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
import { Search, Check, ArrowLeft, Utensils } from 'lucide-react'

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

const ProductItem = memo(function ProductItem({ 
  product, 
  onSelect 
}: { 
  product: Product
  onSelect: (product: Product) => void 
}) {
  const handleClick = useCallback(() => onSelect(product), [product, onSelect])
  
  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 rounded-2xl hover:bg-surface-container active:bg-surface-container-high transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {product.serving}{product.unit} | {product.category}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-semibold text-sm text-primary">{product.calories} kcal</p>
          <div className="flex gap-2 text-[10px] text-muted-foreground mt-0.5">
            <span className="text-protein">B{product.protein}</span>
            <span className="text-carbs">W{product.carbs}</span>
            <span className="text-fat">T{product.fat}</span>
          </div>
        </div>
      </div>
    </button>
  )
})

export function AddMealDialog({ open, onOpenChange, mealType }: AddMealDialogProps) {
  const { products, addMealEntry, selectedDate } = useDiet()
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState('')

  const filteredProducts = useMemo(() => 
    products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  )

  const nutritionValues = useMemo(() => {
    if (!selectedProduct || !quantity) return null
    const multiplier = parseFloat(quantity || '0') / selectedProduct.serving
    return {
      calories: Math.round(selectedProduct.calories * multiplier),
      protein: Math.round(selectedProduct.protein * multiplier),
      carbs: Math.round(selectedProduct.carbs * multiplier),
      fat: Math.round(selectedProduct.fat * multiplier),
    }
  }, [selectedProduct, quantity])

  const handleAdd = useCallback(() => {
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
  }, [selectedProduct, quantity, addMealEntry, mealType, selectedDate, onOpenChange])

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
    setQuantity(product.serving.toString())
  }, [])

  const handleBack = useCallback(() => {
    setSelectedProduct(null)
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }, [])

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <Utensils className="h-5 w-5 text-primary" />
            </span>
            <DialogTitle className="text-lg">Dodaj do: {mealTypeLabels[mealType]}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {!selectedProduct ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Szukaj produktu..."
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-12 h-12 rounded-2xl bg-surface-container border-0 focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <ScrollArea className="h-[320px] -mx-2">
                <div className="space-y-1 px-2">
                  {filteredProducts.map((product) => (
                    <ProductItem 
                      key={product.id} 
                      product={product} 
                      onSelect={handleProductSelect} 
                    />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nie znaleziono produktów</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Selected product card */}
              <div className="p-4 rounded-2xl bg-primary-container">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{selectedProduct.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="rounded-xl h-9 px-3 hover:bg-surface-container"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Zmień
                  </Button>
                </div>
              </div>

              {/* Quantity input */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Ilość ({selectedProduct.unit})
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder={`np. ${selectedProduct.serving}`}
                  className="h-12 rounded-2xl bg-surface-container border-0 text-center text-lg font-semibold focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Nutrition preview */}
              {nutritionValues && (
                <div className="p-4 rounded-2xl bg-surface-container">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Wartości odżywcze</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 rounded-xl bg-primary/10">
                      <p className="text-[10px] text-muted-foreground uppercase">kcal</p>
                      <p className="font-bold text-lg text-primary tabular-nums">{nutritionValues.calories}</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-protein/10">
                      <p className="text-[10px] text-muted-foreground uppercase">białko</p>
                      <p className="font-bold text-lg text-protein tabular-nums">{nutritionValues.protein}g</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-carbs/10">
                      <p className="text-[10px] text-muted-foreground uppercase">węgle</p>
                      <p className="font-bold text-lg text-carbs tabular-nums">{nutritionValues.carbs}g</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-fat/10">
                      <p className="text-[10px] text-muted-foreground uppercase">tłuszcze</p>
                      <p className="font-bold text-lg text-fat tabular-nums">{nutritionValues.fat}g</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Add button */}
              <Button 
                onClick={handleAdd} 
                className="w-full h-12 rounded-2xl text-base font-semibold elevation-2 hover:elevation-3 transition-all duration-200 active:scale-[0.98]" 
                disabled={!quantity}
              >
                <Check className="h-5 w-5 mr-2" />
                Dodaj posiłek
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
