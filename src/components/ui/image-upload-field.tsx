'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import type { StorageImageFolder } from '@/lib/constants'
import { uploadImage } from '@/lib/storage'

export interface ImageUploadFieldProps {
  value: string
  onChange: (url: string) => void
  label?: string
  /** Sous-dossier du bucket (products, halls, etc.) — pas de mélange des types. */
  folder: StorageImageFolder
  error?: boolean
  disabled?: boolean
  className?: string
}

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

export function ImageUploadField({
  value,
  onChange,
  label = "Image",
  folder,
  error,
  disabled,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l’upload')
    } finally {
      setUploading(false)
    }
  }

  const handleClear = () => {
    onChange('')
    setUploadError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        className={cn(
          'rounded-lg border bg-white overflow-hidden',
          error ? 'border-red-500' : 'border-gray-300'
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3">
          <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {value ? (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              onChange={handleFileChange}
              disabled={disabled || uploading}
              className="hidden"
              aria-label={label}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="gap-2 shrink-0"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Téléversement…
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  Choisir une image
                </>
              )}
            </Button>
            {value && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClear}
                disabled={disabled || uploading}
                className="gap-2 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
        {uploadError && (
          <div className="px-3 pb-3">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}
      </div>
    </div>
  )
}
