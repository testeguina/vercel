"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { consultarCPF, testarConexaoAPI } from "@/lib/cpf-api"
import Image from "next/image"
import Link from "next/link"

export default function TestApiPage() {
  const [cpfTest, setCpfTest] = useState("")
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [connectionTest, setConnectionTest] = useState<any>(null)

  const handleTestCpf = async () => {
    if (!cpfTest) return

    setLoading(true)
    try {
      const result = await consultarCPF(cpfTest)
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: "Erro ao testar CPF",
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async () => {
    setLoading(true)
    try {
      const result = await testarConexaoAPI()
      setConnectionTest(result)
    } catch (error) {
      setConnectionTest({
        success: false,
        message: "Erro ao testar conexão",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCpfInput = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let formatted = ""

    if (digits.length > 0) formatted += digits.substring(0, Math.min(3, digits.length))
    if (digits.length > 3) formatted += "." + digits.substring(3, Math.min(6, digits.length))
    if (digits.length > 6) formatted += "." + digits.substring(6, Math.min(9, digits.length))
    if (digits.length > 9) formatted += "-" + digits.substring(9, Math.min(11, digits.length))

    return formatted
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/correios-logo.png" alt="Correios" width={300} height={60} className="h-7 w-auto" priority />
              <span className="ml-4 text-lg font-medium text-gray-700">Teste da API CPF</span>
            </div>
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              Voltar ao Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Teste da API CPF</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teste de Conexão */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">1. Teste de Conexão</h3>
              <Button onClick={handleTestConnection} disabled={loading} variant="outline">
                {loading ? "Testando..." : "Testar Conexão com API"}
              </Button>

              {connectionTest && (
                <div
                  className={`p-4 rounded-md ${
                    connectionTest.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p className={connectionTest.success ? "text-green-700" : "text-red-700"}>
                    {connectionTest.success ? "✅" : "❌"} {connectionTest.message}
                  </p>
                </div>
              )}
            </div>

            {/* Teste de CPF */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-medium">2. Teste de Consulta CPF</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="cpf-test">CPF para teste</Label>
                  <Input
                    id="cpf-test"
                    placeholder="Digite um CPF (ex: 123.456.789-00)"
                    value={cpfTest}
                    onChange={(e) => setCpfTest(formatCpfInput(e.target.value))}
                    maxLength={14}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleTestCpf} disabled={loading || !cpfTest}>
                    {loading ? "Consultando..." : "Consultar CPF"}
                  </Button>
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-4 rounded-md ${
                    testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <h4 className={`font-medium mb-2 ${testResult.success ? "text-green-700" : "text-red-700"}`}>
                    {testResult.success ? "✅ Sucesso" : "❌ Erro"}
                  </h4>
                  <pre className="text-sm overflow-auto bg-white p-3 rounded border">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Instruções */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">📋 Instruções de Configuração</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Para usar a API real:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                  <li>
                    Obtenha sua chave API em{" "}
                    <a href="https://apela-api.tech" target="_blank" rel="noopener noreferrer" className="underline">
                      apela-api.tech
                    </a>
                  </li>
                  <li>
                    Substitua <code className="bg-yellow-100 px-1 rounded">"sua_chave_api_aqui"</code> no arquivo{" "}
                    <code className="bg-yellow-100 px-1 rounded">lib/cpf-api.ts</code>
                  </li>
                  <li>Teste a conexão usando o botão acima</li>
                  <li>Teste consultas de CPF reais</li>
                </ol>
              </div>
            </div>

            {/* Códigos de Status */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">📊 Códigos de Status da API</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">200</span>
                    <span>Sucesso - CPF encontrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">400</span>
                    <span>CPF inválido ou mal formatado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">401</span>
                    <span>Chave API inválida</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">403</span>
                    <span>Chave API expirada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">404</span>
                    <span>CPF não encontrado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">429</span>
                    <span>Limite de requisições excedido</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
