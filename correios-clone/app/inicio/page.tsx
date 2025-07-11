"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { trackPageView, trackEvent } from "@/components/google-analytics"

export default function InicioPage() {
  useEffect(() => {
    trackPageView("Página Inicial - Correios")
  }, [])

  const handleConsultarClick = () => {
    trackEvent("consultar_click", "engagement", "botao_consultar_agora")
  }

  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/correios-logo.png" alt="Correios" width={300} height={60} className="h-8 w-auto" priority />
            </div>
            <div className="text-xs">
              <Link href="#" className="text-blue-600 hover:underline">
                Acessibilidade
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Main Content */}
            <div className="mb-8">
              <h1 className="text-xl font-medium text-gray-800 mb-6">
                CLIQUE NO BOTÃO ABAIXO PARA REALIZAR A CONSULTA.
              </h1>

              {/* Animated Button */}
              <Link href="/" onClick={handleConsultarClick}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-medium rounded animate-pulse-gentle w-full sm:w-auto">
                  CONSULTAR AGORA
                </Button>
              </Link>
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm">
                <Link href="#" className="text-blue-600 hover:underline">
                  Políticas de Privacidade
                </Link>
                <Link href="#" className="text-blue-600 hover:underline">
                  Termos de Uso
                </Link>
                <Link href="#" className="text-blue-600 hover:underline">
                  Serviços de Atendimento
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-yellow-400 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-800">Central de Atendimento: 0800 725 0100</p>
        </div>
      </footer>
    </div>
  )
}
