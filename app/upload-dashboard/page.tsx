'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UploadDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    console.log('Upload Dashboard page accessed - redirecting to documentos')
    router.replace('/documentos')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Redirecionando...</h2>
        <p className="text-muted-foreground">Você será direcionado para a página de documentos.</p>
      </div>
    </div>
  )
}