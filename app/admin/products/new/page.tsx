"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct } from '@/api/admin/products';
import { getCategories } from '@/api/admin/categories';
import type { Category } from '@/api/admin/categories';

function slugFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function ProductCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [nutritionText, setNutritionText] = useState('');
  const [cardLabel, setCardLabel] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const CARD_LABEL_OPTIONS = [
    { value: '', label: 'None' },
    { value: 'Bestseller', label: 'Bestseller' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Favourite', label: 'Favourite' },
    { value: 'New drop', label: 'New drop' },
    { value: 'Value', label: 'Value' },
  ];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.categories))
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !categoryId) return;
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
    setSubmitting(true);
    setError(null);
    createProduct({
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
      .then((res) => router.replace(`/admin/products/${res.product.id}`))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to create product'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add product</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Name *</span>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug || slug === slugFromName(name)) setSlug(slugFromName(e.target.value));
            }}
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Slug *</span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Category *</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Card label</span>
          <select
            value={cardLabel}
            onChange={(e) => setCardLabel(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          >
            {CARD_LABEL_OPTIONS.map((opt) => (
              <option key={opt.value || 'none'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">Shown on product card (e.g. Bestseller, Hot)</p>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Short description</span>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Ingredients</span>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={3}
            placeholder="E.g. Almonds, Cocoa, Sea salt"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Nutrition</span>
          <textarea
            value={nutritionText}
            onChange={(e) => setNutritionText(e.target.value)}
            rows={4}
            placeholder={"Calories: 120\nProtein: 4g\nSugar: 2g"}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            One per line as <span className="font-mono">Label: Value</span>.
          </p>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
          />
          <span className="text-sm font-medium text-slate-600">Active</span>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Sort order</span>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            className="mt-1 block w-full max-w-[120px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </label>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !name.trim() || !slug.trim() || !categoryId}
            className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating…' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
