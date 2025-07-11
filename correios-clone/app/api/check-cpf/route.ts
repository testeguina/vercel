import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { cpf } = await request.json()

    if (!cpf) {
      return NextResponse.json({ success: false, message: "CPF é obrigatório" }, { status: 400 })
    }

    // Normalizar CPF
    const normalizedCpf = cpf.replace(/\D/g, "")

    if (normalizedCpf.length !== 11) {
      return NextResponse.json({ success: false, message: "CPF inválido" }, { status: 400 })
    }

    // Buscar no localStorage (simulando busca no banco)
    // Como não podemos acessar localStorage no servidor, vamos retornar uma resposta baseada no CPF
    // Em produção, isso seria uma consulta real ao banco de dados

    // Para demonstração, vamos simular alguns CPFs válidos
    const validCpfs = [
      "04556580722", // CPF do exemplo
      "12345678901",
      "98765432100",
      "11122233344",
      "55566677788",
      "99988877766",
    ]

    // Verificar se o CPF está na lista (em produção seria uma consulta ao banco)
    const found = validCpfs.includes(normalizedCpf)

    if (found) {
      return NextResponse.json({
        success: true,
        message: "CPF encontrado",
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "CPF não encontrado em nossa base de dados.",
      })
    }
  } catch (error) {
    console.error("Erro ao verificar CPF:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
