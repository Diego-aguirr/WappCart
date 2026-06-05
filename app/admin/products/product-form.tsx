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

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export default function ProductForm({ id, defaultValues }: ProductFormProps) {
  const [name, setName] = useState(defaultValues?.name || '')
  const [slug, setSlug] = useState(defaultValues?.slug || '')
  const [imageUrl, setImageUrl] = useState(defaultValues?.image || '')
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const [uploadMessage, setUploadMessage] = useState('')

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!id) {
      setSlug(slugify(newName))
    }
  }, [id])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadStatus('uploading')
    setUploadMessage('')

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
        setUploadStatus('success')
        setUploadMessage(data.message || 'Imagen cargada exitosamente')
      } else {
        setUploadStatus('error')
        setUploadMessage(data.error || 'Error al cargar la imagen')
      }
    } catch {
      setUploadStatus('error')
      setUploadMessage('Error de conexión al subir imagen')
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
        <label htmlFor="image-file" className="block text-sm font-medium mb-1">
          Product Image
        </label>
        <input
          type="file"
          id="image-file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border rounded px-3 py-2"
        />
        <input type="hidden" name="image" value={imageUrl} key={imageUrl || 'empty'} />
        {uploadStatus === 'uploading' && (
          <p className="text-blue-600 text-xs mt-1">Subiendo imagen...</p>
        )}
        {uploadStatus === 'success' && (
          <p className="text-green-600 text-sm mt-1 font-medium">{uploadMessage}</p>
        )}
        {uploadStatus === 'error' && (
          <p className="text-red-600 text-sm mt-1">{uploadMessage}</p>
        )}
        {imageUrl && uploadStatus === 'success' && (
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
