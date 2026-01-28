import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/health/supabase
 * Vérifie la connexion à Supabase et l’accès à la table categories.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json(
      {
        ok: false,
        error: 'missing_config',
        message:
          'NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY manquant. ' +
          'Copiez .env.example en .env.local et remplissez les valeurs (Supabase Dashboard).',
      },
      { status: 503 }
    )
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('categories').select('id').limit(1)

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: 'supabase_error',
          message: error.message,
          code: error.code,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok: true,
      message: 'Connexion Supabase OK',
      checked: 'categories',
      sample: data ?? [],
    })
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e))
    return NextResponse.json(
      {
        ok: false,
        error: 'unexpected',
        message: err.message,
      },
      { status: 500 }
    )
  }
}
