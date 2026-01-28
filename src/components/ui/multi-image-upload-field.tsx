'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import type { StorageImageFolder } from '@/lib/constants'
import { uploadImage } from '@/lib/storage'

export interface MultiImageUploadFieldProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
  folder: StorageImageFolder
  error?: boolean
  disabled?: boolean
  className?: string
  maxImages?: number
}

const ACCEPT = 'image/jpeg,image/png,image/gif,image/webp'

export function MultiImageUploadField({
  value,
  onChange,
  label = 'Images',
  folder,
  error,
  disabled,
  className,
  maxImages = 20,
}: MultiImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    e.target.value = ''
    if (!files.length) return
    const remaining = maxImages - value.length
    if (remaining <= 0) {
      setUploadError(`Maximum ${maxImages} image(s) autorisées.`)
      return
    }
    const toUpload = files.slice(0, remaining)
    setUploadError(null)
    setUploading(true)
    const newUrls: string[] = []
    try {
      for (const file of toUpload) {
        const url = await uploadImage(file, folder)
        newUrls.push(url)
      }
      onChange([...value, ...newUrls])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l’upload')
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
    setUploadError(null)
  }

  const canAdd = value.length < maxImages && !disabled && !uploading

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
        <div className="p-3 space-y-3">
          {value.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {value.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    disabled={disabled || uploading}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={handleFileChange}
              disabled={!canAdd}
              className="hidden"
              aria-label={label}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={!canAdd}
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
                  Choisir des images
                </>
              )}
            </Button>
            {value.length > 0 && (
              <span className="text-xs text-gray-500">
                {value.length} / {maxImages} image(s)
              </span>
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
