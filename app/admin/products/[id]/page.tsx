"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  getProductById,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  uploadProductImages,
  updateImageSortOrder,
  deleteProductImage,
  formatPaise,
  type Product,
  type ProductVariant,
  type ProductImage,
} from '@/api/admin/products';
import { getCategories } from '@/api/admin/categories';
import type { Category } from '@/api/admin/categories';

// ----- Basic product form -----
function ProductBasicForm({
  product,
  categories,
  onSaved,
}: {
  product: Product;
  categories: Category[];
  onSaved: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [categoryId, setCategoryId] = useState(product.categoryId);
  const [description, setDescription] = useState(product.description);
  const [shortDescription, setShortDescription] = useState(product.shortDescription ?? '');
  const [ingredients, setIngredients] = useState(product.ingredients ?? '');
  const [nutritionText, setNutritionText] = useState(
    product.nutrition && product.nutrition.length > 0
      ? product.nutrition.map((r) => `${r.label}: ${r.value}`).join('\n')
      : ''
  );
  const [cardLabel, setCardLabel] = useState(product.cardLabel ?? '');
  const [isActive, setIsActive] = useState(product.isActive);
  const [sortOrder, setSortOrder] = useState(product.sortOrder);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CARD_LABEL_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'Bestseller', label: 'Bestseller' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Favourite', label: 'Favourite' },
    { value: 'New drop', label: 'New drop' },
    { value: 'Value', label: 'Value' },
  ];

  useEffect(() => {
    setName(product.name);
    setSlug(product.slug);
    setCategoryId(product.categoryId);
    setDescription(product.description);
    setShortDescription(product.shortDescription ?? '');
    setIngredients(product.ingredients ?? '');
    setNutritionText(
      product.nutrition && product.nutrition.length > 0
        ? product.nutrition.map((r) => `${r.label}: ${r.value}`).join('\n')
        : ''
    );
    setCardLabel(product.cardLabel ?? '');
    setIsActive(product.isActive);
    setSortOrder(product.sortOrder);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nutrition = nutritionText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const idx = line.indexOf(':');
        if (idx < 0) return null;
        const label = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        if (!label || !value) return null;
        return { label, value };
      })
      .filter(Boolean) as { label: string; value: string }[];
    setSaving(true);
    setError(null);
    updateProduct(product.id, {
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      categoryId,
      description: description.trim(),
      shortDescription: shortDescription.trim() || null,
      ingredients: ingredients.trim() || null,
      nutrition: nutrition.length > 0 ? nutrition : null,
      cardLabel: cardLabel.trim() || null,
      isActive,
      sortOrder,
    })
      .then(() => onSaved())
      .catch((err) => setError(err instanceof Error ? err.message : 'Update failed'))
      .finally(() => setSaving(false));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-medium text-slate-600">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-600">Slug</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Category</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 block w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Short description</span>
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Card label</span>
        <select
          value={cardLabel}
          onChange={(e) => setCardLabel(e.target.value)}
          className="mt-1 block w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {CARD_LABEL_OPTIONS.map((opt) => (
            <option key={opt.value || 'none'} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {cardLabel && !CARD_LABEL_OPTIONS.some((o) => o.value === cardLabel) && (
            <option value={cardLabel}>{cardLabel}</option>
          )}
        </select>
        <p className="mt-1 text-xs text-slate-500">Shown on product card (e.g. Bestseller, Hot)</p>
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Ingredients</span>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          placeholder="E.g. Almonds, Cocoa, Sea salt"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium text-slate-600">Nutrition</span>
        <textarea
          value={nutritionText}
          onChange={(e) => setNutritionText(e.target.value)}
          rows={4}
          placeholder={"Calories: 120\nProtein: 4g\nSugar: 2g"}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
        />
        <p className="mt-1 text-xs text-slate-500">
          One per line as <span className="font-mono">Label: Value</span>.
        </p>
      </label>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="text-sm text-slate-600">Active</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Sort order</span>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  );
}

// ----- Variants section -----
function VariantsSection({
  productId,
  variants,
  onRefresh,
}: {
  productId: string;
  variants: ProductVariant[];
  onRefresh: () => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [vName, setVName] = useState('');
  const [vSku, setVSku] = useState('');
  const [vPricePaise, setVPricePaise] = useState('');
  const [vComparePaise, setVComparePaise] = useState('');
  const [vStock, setVStock] = useState(0);
  const [vWeight, setVWeight] = useState('');
  const [vOutOfStock, setVOutOfStock] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setVName('');
    setVSku('');
    setVPricePaise('');
    setVComparePaise('');
    setVStock(0);
    setVWeight('');
    setVOutOfStock(false);
    setFormError(null);
    setEditing(null);
    setAddOpen(false);
  };

  const openEdit = (v: ProductVariant) => {
    setEditing(v);
    setVName(v.name);
    setVSku(v.sku);
    setVPricePaise((v.price / 100).toFixed(2));
    setVComparePaise(v.compareAtPrice != null ? (v.compareAtPrice / 100).toFixed(2) : '');
    setVStock(v.stock);
    setVWeight(v.weightGrams != null ? String(v.weightGrams) : '');
    setVOutOfStock(v.outOfStock);
    setFormError(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const priceRupees = parseFloat(vPricePaise);
    const price = Math.round((Number.isFinite(priceRupees) ? priceRupees : 0) * 100);
    if (!vName.trim() || !vSku.trim() || price < 0) {
      setFormError('Name, SKU, and price (₹) are required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const compareRupees = vComparePaise === '' ? null : parseFloat(vComparePaise);
    addVariant(productId, {
      name: vName.trim(),
      sku: vSku.trim().toUpperCase(),
      price,
      compareAtPrice: compareRupees != null && Number.isFinite(compareRupees) ? Math.round(compareRupees * 100) : null,
      stock: vStock,
      weightGrams: vWeight === '' ? null : Math.round(parseFloat(vWeight) || 0),
      outOfStock: vOutOfStock,
    })
      .then(() => { resetForm(); onRefresh(); })
      .catch((err) => setFormError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setSaving(false));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const priceRupees = parseFloat(vPricePaise);
    const price = Math.round((Number.isFinite(priceRupees) ? priceRupees : 0) * 100);
    if (!vName.trim() || !vSku.trim()) {
      setFormError('Name and SKU required.');
      return;
    }
    setSaving(true);
    setFormError(null);
    const compareRupees = vComparePaise === '' ? null : parseFloat(vComparePaise);
    updateVariant(productId, editing.id, {
      name: vName.trim(),
      sku: vSku.trim().toUpperCase(),
      price,
      compareAtPrice: compareRupees != null && Number.isFinite(compareRupees) ? Math.round(compareRupees * 100) : null,
      stock: vStock,
      weightGrams: vWeight === '' ? null : Math.round(parseFloat(vWeight) || 0),
      outOfStock: vOutOfStock,
    })
      .then(() => { resetForm(); onRefresh(); })
      .catch((err) => setFormError(err instanceof Error ? err.message : 'Failed'))
      .finally(() => setSaving(false));
  };

  const handleDelete = (vid: string) => {
    if (!confirm('Delete this variant? (Not allowed if in cart/orders)')) return;
    setDeletingId(vid);
    deleteVariant(productId, vid)
      .then(() => onRefresh())
      .catch(() => {})
      .finally(() => setDeletingId(null));
  };

  const handleOutOfStockToggle = (v: ProductVariant) => {
    updateVariant(productId, v.id, { outOfStock: !v.outOfStock })
      .then(() => onRefresh())
      .catch(() => {});
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Variants</h3>
        <button
          type="button"
          onClick={() => { resetForm(); setAddOpen(true); }}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          + Add variant
        </button>
      </div>

      {(addOpen || editing) && (
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <form onSubmit={editing ? handleUpdate : handleAdd} className="space-y-3">
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label>
                <span className="text-xs text-slate-600">Name</span>
                <input
                  type="text"
                  value={vName}
                  onChange={(e) => setVName(e.target.value)}
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-600">SKU</span>
                <input
                  type="text"
                  value={vSku}
                  onChange={(e) => setVSku(e.target.value.toUpperCase())}
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-600">Price (₹)</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={vPricePaise}
                  onChange={(e) => setVPricePaise(e.target.value)}
                  placeholder="0.00"
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-600">Compare at (₹)</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={vComparePaise}
                  onChange={(e) => setVComparePaise(e.target.value)}
                  placeholder="0.00"
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-600">Stock</span>
                <input
                  type="number"
                  min={0}
                  value={vStock}
                  onChange={(e) => setVStock(parseInt(e.target.value, 10) || 0)}
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label>
                <span className="text-xs text-slate-600">Weight (g)</span>
                <input
                  type="number"
                  min={0}
                  value={vWeight}
                  onChange={(e) => setVWeight(e.target.value)}
                  placeholder="—"
                  className="mt-0.5 block w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  checked={vOutOfStock}
                  onChange={(e) => setVOutOfStock(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span className="text-sm text-slate-600">Out of stock</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-3 py-1.5 text-sm font-medium rounded bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {saving ? 'Saving…' : editing ? 'Save' : 'Add'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1.5 text-sm font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {variants.length === 0 ? (
        <p className="text-sm text-slate-500">No variants yet.</p>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">Name</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-slate-500">SKU</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Price</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Compare</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Stock</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Weight</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-slate-500">OOS</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {variants.map((v) => (
                <tr key={v.id}>
                  <td className="px-3 py-2 font-medium text-slate-800">{v.name}</td>
                  <td className="px-3 py-2 text-slate-600 font-mono">{v.sku}</td>
                  <td className="px-3 py-2 text-right text-slate-800">{formatPaise(v.price)}</td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    {v.compareAtPrice != null ? formatPaise(v.compareAtPrice) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-800">{v.stock}</td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    {v.weightGrams != null ? `${v.weightGrams}g` : '—'}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleOutOfStockToggle(v)}
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        v.outOfStock ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {v.outOfStock ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(v)}
                      className="text-slate-600 hover:text-slate-900 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(v.id)}
                      disabled={deletingId === v.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      {deletingId === v.id ? '…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ----- Images section -----
function ImagesSection({
  productId,
  images,
  onRefresh,
}: {
  productId: string;
  images: ProductImage[];
  onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError(null);
    setUploading(true);
    const fileList = Array.from(files);
    uploadProductImages(productId, fileList)
      .then(() => onRefresh())
      .catch((err) => setUploadError(err instanceof Error ? err.message : 'Upload failed'))
      .finally(() => {
        setUploading(false);
        e.target.value = '';
      });
  };

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleMove = (img: ProductImage, delta: number) => {
    const idx = sorted.findIndex((i) => i.id === img.id);
    if (idx < 0) return;
    const newIdx = Math.max(0, Math.min(sorted.length - 1, idx + delta));
    if (newIdx === idx) return;
    const other = sorted[newIdx];
    // Swap sortOrder with the image we're moving past
    Promise.all([
      updateImageSortOrder(productId, img.id, other.sortOrder),
      updateImageSortOrder(productId, other.id, img.sortOrder),
    ])
      .then(() => onRefresh())
      .catch(() => {});
  };

  const handleDeleteImg = (imageId: string) => {
    if (!confirm('Remove this image?')) return;
    setDeletingId(imageId);
    deleteProductImage(productId, imageId)
      .then(() => onRefresh())
      .catch(() => {})
      .finally(() => setDeletingId(null));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">Images</h3>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <span className="inline-block px-3 py-2 text-sm font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
            {uploading ? 'Uploading…' : 'Upload images'}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-slate-500">No images yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {sorted.map((img, idx) => (
            <div key={img.id} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
              <img src={img.url} alt="" className="w-32 h-32 object-cover" />
              <div className="p-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Order: {img.sortOrder}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(img, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                    title="Move left"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(img, 1)}
                    disabled={idx === sorted.length - 1}
                    className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                    title="Move right"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteImg(img.id)}
                    disabled={deletingId === img.id}
                    className="p-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ----- Main edit page -----
export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = () => {
    if (!id) return;
    getProductById(id)
      .then((res) => setProduct(res.product))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product'));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getCategories().then((res) => setCategories(res.categories)).catch(() => {});
    getProductById(id)
      .then((res) => {
        setProduct(res.product);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);


  if (loading && !product) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
        <Link href="/admin/products" className="mt-4 inline-block text-sm text-slate-600 hover:text-slate-900">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <Link href="/admin/products" className="text-sm text-slate-600 hover:text-slate-900 mb-1 inline-block">
          ← Back to products
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Edit: {product.name}</h1>
      </div>

      <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Basic details</h2>
        <ProductBasicForm
          product={product}
          categories={categories}
          onSaved={() => loadProduct()}
        />
      </section>

      <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <VariantsSection
          productId={product.id}
          variants={product.variants}
          onRefresh={loadProduct}
        />
      </section>

      <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <ImagesSection
          productId={product.id}
          images={product.images}
          onRefresh={loadProduct}
        />
      </section>
    </div>
  );
}
