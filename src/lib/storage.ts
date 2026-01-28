import { supabase } from '@/lib/supabase'
import type { StorageImageFolder } from '@/lib/constants'
import {
  STORAGE_BUCKET_IMAGES,
  STORAGE_IMAGE_MAX_BYTES,
  STORAGE_IMAGE_ACCEPT,
  STORAGE_IMAGE_FOLDERS,
} from '@/lib/constants'

const ALLOWED_FOLDERS = new Set<StorageImageFolder>(
  Object.values(STORAGE_IMAGE_FOLDERS)
)

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80)
}

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }
  return map[mime] ?? 'jpg'
}

/**
 * Upload an image file to Supabase Storage (bucket "images").
 * Les images sont classées par sous-dossier (products, halls, etc.) — pas de mélange.
 *
 * @param file - Image file (JPEG, PNG, GIF, WebP)
 * @param folder - Sous-dossier autorisé (cf. STORAGE_IMAGE_FOLDERS)
 * @returns Public URL of the uploaded file
 * @throws Error if validation or upload fails
 */
export async function uploadImage(
  file: File,
  folder: StorageImageFolder
): Promise<string> {
  const mime = file.type.toLowerCase()
  if (!/^image\/(jpeg|png|gif|webp)$/i.test(mime)) {
    throw new Error(
      `Type de fichier non accepté. Utilisez : ${STORAGE_IMAGE_ACCEPT.join(', ')}`
    )
  }
  if (file.size > STORAGE_IMAGE_MAX_BYTES) {
    throw new Error(
      `Fichier trop volumineux. Taille max : ${STORAGE_IMAGE_MAX_BYTES / 1024 / 1024} MB`
    )
  }

  if (!ALLOWED_FOLDERS.has(folder)) {
    throw new Error(
      `Dossier non autorisé. Utilisez : ${[...ALLOWED_FOLDERS].join(', ')}`
    )
  }

  const ext = getExtension(mime)
  const base = sanitizeFilename(file.name.replace(/\.[^/.]+$/, '')) || 'image'
  const path = `${folder}/${Date.now()}-${base}.${ext}`

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_IMAGES)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET_IMAGES)
    .getPublicUrl(data.path)
  return urlData.publicUrl
}
