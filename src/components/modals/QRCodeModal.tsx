'use client'

import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Printer, Copy, Check, X } from 'lucide-react'
import { BaseModal } from './BaseModal'
import { Button } from '@/components/ui'
import type { RestaurantTable } from '@/types'

// ============================================
// QR CODE MODAL
// ============================================

interface QRCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: RestaurantTable | null
}

export function QRCodeModal({ open, onOpenChange, table }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  if (!table) return null

  // Générer l'URL complète pour le QR code
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const qrUrl = `${baseUrl}/table/${table.number}`
  const qrSlug = `table-${table.number}`

  const handleDownload = () => {
    if (!qrRef.current) return

    // Créer un canvas pour exporter le QR code
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        if (!blob) return
        
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `qr-code-table-${table.number}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const handlePrint = () => {
    if (!qrRef.current) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Table ${table.number}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            .qr-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .qr-subtitle {
              font-size: 16px;
              color: #666;
              margin-top: 20px;
            }
            svg {
              max-width: 400px;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">Table ${table.number}</div>
            ${svg.outerHTML}
            <div class="qr-subtitle">Scannez pour commander</div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={`QR Code - Table ${table.number}`}
      description="Scannez ce QR code pour accéder au menu de la table"
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyUrl}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                URL copiée
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copier l'URL
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
          <div ref={qrRef} className="p-4 bg-white rounded-lg shadow-sm">
            <QRCodeSVG
              value={qrUrl}
              size={256}
              level="H"
              includeMargin={true}
              fgColor="#1F2937"
              bgColor="#FFFFFF"
            />
          </div>
        </div>

        {/* Table Info */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Informations de la table</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Numéro de table :</span>
                <span>{table.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Capacité :</span>
                <span>{table.capacity} {table.capacity === 1 ? 'personne' : 'personnes'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Statut :</span>
                <span className="capitalize">
                  {table.status === 'available' && 'Libre'}
                  {table.status === 'occupied' && 'Occupée'}
                  {table.status === 'reserved' && 'Réservée'}
                </span>
              </div>
            </div>
          </div>

          {/* URL Display */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">URL du QR Code</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs text-gray-600 bg-white px-3 py-2 rounded border border-gray-200 break-all">
                {qrUrl}
              </code>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCopyUrl}
                title="Copier l'URL"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Instructions</h3>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li>Imprimez ce QR code et placez-le sur la table</li>
              <li>Les clients peuvent scanner le code pour accéder au menu</li>
              <li>Les commandes seront automatiquement associées à cette table</li>
            </ul>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
