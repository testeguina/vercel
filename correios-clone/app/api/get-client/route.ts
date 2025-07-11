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

    // Dados de exemplo baseados no schema fornecido
    const sampleClients: { [key: string]: any } = {
      "04556580722": {
        name: "Fábio de Souza pierrot",
        email: "fabiopierrot@yahoo.com.br",
        cpf: "045.565.807-22",
        telefone: "(21) 97018-1629",
        endereco: "Rua Várzea Alegre, 115, Casa",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "23070340",
        pais: "Brasil",
        produto: "ZMA (120 CAPS) - GROWTH SUPPLEMENTS",
        valorTotal: "37,90",
        formaPagamento: "Pix",
        status: "Pago",
      },
      "12345678901": {
        name: "João Silva Santos",
        email: "joao.silva@email.com",
        cpf: "123.456.789-01",
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123",
        cidade: "São Paulo",
        estado: "SP",
        cep: "05432100",
        pais: "Brasil",
        produto: "Smartphone Samsung Galaxy",
        valorTotal: "37,90",
        formaPagamento: "Cartão de Crédito",
        status: "Pendente",
      },
      "98765432100": {
        name: "Maria Oliveira Costa",
        email: "maria.oliveira@gmail.com",
        cpf: "987.654.321-00",
        telefone: "(21) 97654-3210",
        endereco: "Avenida Copacabana, 456",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        cep: "22070001",
        pais: "Brasil",
        produto: "Notebook Dell Inspiron",
        valorTotal: "37,90",
        formaPagamento: "PIX",
        status: "Em trânsito",
      },
    }

    const client = sampleClients[normalizedCpf]

    if (client) {
      return NextResponse.json({
        success: true,
        client: client,
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Cliente não encontrado",
      })
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error)
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}
