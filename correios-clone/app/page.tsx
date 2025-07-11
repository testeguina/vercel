"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMobile } from "@/hooks/use-mobile"
import { consultarCPF, isValidCPF } from "@/lib/cpf-api"
import { trackPageView, trackCPFSearch, trackCPFFound } from "@/components/google-analytics"

export default function Home() {
  const [cpf, setCpf] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isMobile = useMobile()

  useEffect(() => {
    trackPageView("Página de Consulta CPF")
  }, [])

  const handleCpfSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const cleanCPF = cpf.replace(/\D/g, "")

      if (!isValidCPF(cleanCPF)) {
        setError("CPF inválido. Por favor, digite um CPF válido.")
        setLoading(false)
        return
      }

      // Rastrear busca por CPF
      trackCPFSearch(cleanCPF)

      // Consultar CPF via API
      const result = await consultarCPF(cleanCPF)

      if (result.success) {
        // Rastrear CPF encontrado
        trackCPFFound()
        // Redirecionar para página de resultado com os dados
        router.push(`/resultado?id=${encodeURIComponent(cleanCPF)}`)
        return
      }

      setError(result.message || "CPF não encontrado em nossa base de dados.")
    } catch (err) {
      setError("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Format CPF as user types
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const digits = value.replace(/\D/g, "")
    let formatted = ""

    if (digits.length > 0) formatted += digits.substring(0, Math.min(3, digits.length))
    if (digits.length > 3) formatted += "." + digits.substring(3, Math.min(6, digits.length))
    if (digits.length > 6) formatted += "." + digits.substring(6, Math.min(9, digits.length))
    if (digits.length > 9) formatted += "-" + digits.substring(9, Math.min(11, digits.length))

    setCpf(formatted)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-2 px-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/correios-logo.png" alt="Correios" width={300} height={60} className="h-7 w-auto" priority />
            </div>
            <div className="text-xs">
              <Link href="#" className="text-blue-600 hover:underline">
                Acessibilidade
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
          <div className="mb-3 sm:mb-4">
            <nav className="text-xs text-gray-600">
              <Link href="/" className="hover:underline">
                Portal Correios
              </Link>{" "}
              {" / "}
              <Link href="#" className="hover:underline">
                Consultas
              </Link>
            </nav>
          </div>

          <h1 className="text-xl font-medium text-blue-800 mb-4 sm:mb-6">Rastreamento</h1>

          <div className="bg-gray-100 p-4 sm:p-6 rounded-md mb-8">
            <form onSubmit={handleCpfSubmit}>
              <div className="mb-4">
                <p className="text-sm mb-2">
                  <strong>Deseja acompanhar seu objeto?</strong>
                  <br />
                  Digite seu CPF para rastreá-lo.
                </p>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite seu CPF (ex: 123.456.789-10)"
                  className="w-full bg-white"
                  value={cpf}
                  onChange={handleCpfChange}
                  required
                  maxLength={14}
                />
              </div>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 w-full sm:w-auto"
                  disabled={loading}
                  size={isMobile ? "lg" : "default"}
                >
                  {loading ? "Processando..." : "Consultar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-yellow-400 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="font-medium mb-2 sm:mb-3">Fale Conosco</h3>
              <ul className="text-sm space-y-1 sm:space-y-2">
                <li>
                  <span className="text-blue-600 cursor-default">Atendimento ao Consumidor</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Central de Atendimento</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Sugestões para o site</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Ouvidoria Correios com contrato</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Denúncia</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 md:mt-0">
              <h3 className="font-medium mb-2 sm:mb-3">Sobre Correios</h3>
              <ul className="text-sm space-y-1 sm:space-y-2">
                <li>
                  <span className="text-blue-600 cursor-default">Identidade Corporativa</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Estrutura e Ações</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Código de Ética</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Transparência e prestação de contas</span>
                </li>
                <li>
                  <span className="text-blue-600 cursor-default">Sustentabilidade e Responsabilidade Social</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 md:mt-0">
              <h3 className="font-medium mb-2 sm:mb-3">Outros Sites</h3>
              <ul className="text-sm space-y-1 sm:space-y-2">
                <li>
                  <span className="text-blue-600 cursor-default">Loja Virtual Correios</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-center text-sm">
            <p>Central de Atendimento: 0800 725 0100</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
