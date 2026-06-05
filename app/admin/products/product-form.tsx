'use client'

import { useActionState, useState, useCallback } from 'react'
import Link from 'next/link'
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

export default function ProductForm({ id, defaultValues }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.image || '')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      alert('Upload error')
    } finally {
      setUploading(false)
    }
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
          defaultValue={defaultValues?.name}
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
          defaultValue={defaultValues?.slug}
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., pizza-muzzarella"
        />
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
        <label htmlFor="image-file" className="block text-sm font-medium mb-1">
          Product Image
        </label>
        <input
          type="file"
          id="image-file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded px-3 py-2"
        />
        <input type="hidden" name="image" value={imageUrl} required />
        {uploading && (
          <p className="text-blue-600 text-xs mt-1">Uploading...</p>
        )}
        {imageUrl && (
          <div className="mt-2">
            <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded border" />
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
