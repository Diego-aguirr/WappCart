'use client'

import { useActionState, useState, useCallback } from 'react'
import { createProductAction, updateProductAction } from '../actions'
import type { ActionState } from '../actions'

interface ProductFormProps {
  id?: string
  defaultValues?: {
    name: string
    slug: string
    description: string
    price: number
    image: string
    category: string
    available: boolean
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type ImageStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ProductForm({ id, defaultValues }: ProductFormProps) {
  const [name, setName] = useState(defaultValues?.name || '')
  const [slug, setSlug] = useState(defaultValues?.slug || '')
  const [imageUrl, setImageUrl] = useState(defaultValues?.image || '')
  const [imageStatus, setImageStatus] = useState<ImageStatus>(
    defaultValues?.image ? 'success' : 'idle'
  )

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!id) {
      setSlug(slugify(newName))
    }
  }, [id])

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    if (!url) {
      setImageStatus('idle')
      return
    }
    setImageStatus('loading')
    const img = new Image()
    img.onload = () => setImageStatus('success')
    img.onerror = () => setImageStatus('error')
    img.src = url
  }, [])

  const action = id
    ? async (_state: ActionState, formData: FormData) =>
        updateProductAction(id, null, formData)
    : createProductAction

  const [rawState, formAction, isPending] = useActionState(action, null)
  const state = rawState as ActionState

  const fieldErrors =
    state &&
    'error' in state &&
    typeof state.error === 'object' &&
    state.error !== null &&
    !Array.isArray(state.error)
      ? (state.error as Record<string, string[]>)
      : {}

  const serverError =
    state && 'error' in state && typeof state.error === 'string'
      ? state.error
      : null

  const imageBorderColor =
    imageStatus === 'error'
      ? 'border-red-500'
      : imageStatus === 'success'
      ? 'border-green-500'
      : 'border-gray-300'

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={handleNameChange}
          className="w-full border rounded px-3 py-2"
        />
        {fieldErrors.name && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.name.join(', ')}</p>
        )}
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-1">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          value={slug}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-500"
        />
        <p className="text-xs text-gray-400 mt-1">Generated automatically from name</p>
        {fieldErrors.slug && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.slug.join(', ')}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={defaultValues?.description}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        {fieldErrors.description && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.description.join(', ')}</p>
        )}
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          defaultValue={defaultValues?.price}
          className="w-full border rounded px-3 py-2"
        />
        {fieldErrors.price && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.price.join(', ')}</p>
        )}
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          required
          value={imageUrl}
          onChange={handleImageChange}
          className={`w-full border rounded px-3 py-2 ${imageBorderColor}`}
          placeholder="https://example.com/image.jpg"
        />
        <div className="flex items-center gap-2 mt-1">
          {imageStatus === 'loading' && (
            <span className="text-xs text-blue-600">Checking image...</span>
          )}
          {imageStatus === 'success' && (
            <span className="text-xs text-green-600">Image loaded successfully</span>
          )}
          {imageStatus === 'error' && (
            <span className="text-xs text-red-600">Failed to load image</span>
          )}
        </div>
        {imageUrl && imageStatus === 'success' && (
          <div className="mt-2">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          </div>
        )}
        {fieldErrors.image && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.image.join(', ')}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <input
          id="category"
          name="category"
          required
          defaultValue={defaultValues?.category}
          className="w-full border rounded px-3 py-2"
        />
        {fieldErrors.category && (
          <p className="text-red-600 text-xs mt-1">{fieldErrors.category.join(', ')}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input type="hidden" name="available" value="false" />
        <input
          id="available"
          name="available"
          type="checkbox"
          value="true"
          defaultChecked={defaultValues?.available ?? true}
          className="w-4 h-4"
        />
        <label htmlFor="available" className="text-sm font-medium">
          Available
        </label>
      </div>
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {defaultValues ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}
