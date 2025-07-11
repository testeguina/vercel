// Função para validar CPF
export function isValidCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "")

  if (cleanCPF.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false // CPFs com todos os dígitos iguais

  // Validação do dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let digit1 = 11 - (sum % 11)
  if (digit1 > 9) digit1 = 0

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  let digit2 = 11 - (sum % 11)
  if (digit2 > 9) digit2 = 0

  return digit1 === Number.parseInt(cleanCPF.charAt(9)) && digit2 === Number.parseInt(cleanCPF.charAt(10))
}

// Função para formatar CPF
export function formatCPF(cpf: string): string {
  const cleanCPF = cpf.replace(/\D/g, "")
  if (cleanCPF.length !== 11) return cpf

  return `${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`
}

// Função para consultar CPF via nova API apela-api.tech
export async function consultarCPF(cpf: string): Promise<{
  success: boolean
  data?: any
  message?: string
}> {
  try {
    const cleanCPF = cpf.replace(/\D/g, "")

    if (!isValidCPF(cleanCPF)) {
      return {
        success: false,
        message: "CPF inválido",
      }
    }

    // Nova URL da API
    const url = `https://apela-api.tech/?user=9621f314-a0dc-4939-8d89-05dc2317afa0&cpf=${cleanCPF}`
    const response = await fetch(url, {
      method: "GET",
    })

    const result = await response.json()

    // A nova API retorna os dados em result.data.nome, result.data.mae, result.data.nascimento
    if (response.ok && result.data && result.data.nome) {
      // Gerar dados simulados para o sistema de rastreamento
      const trackingCode = `BR${Math.random().toString().substring(2, 11)}BR`

      return {
        success: true,
        data: {
          cpf: formatCPF(cleanCPF),
          nome: result.data.nome,
          mae: result.data.mae,
          data_nascimento: result.data.nascimento,
          status: "Ativo",
          encomenda: {
            codigo: trackingCode,
            status: "Em trânsito",
            produto: "Encomenda Internacional",
            valor: "37,90",
          },
        },
      }
    }

    // Tratar diferentes códigos de erro (ajustar conforme resposta da nova API)
    if (result.message) {
      return {
        success: false,
        message: result.message,
      }
    }

    return {
      success: false,
      message: "Erro ao consultar CPF.",
    }
  } catch (error) {
    console.error("Erro ao consultar CPF:", error)

    // Se a API falhar, usar dados simulados para demonstração
    const cpfsValidos = ["12345678901", "98765432100", "11122233344", "55566677788", "99988877766"]

    if (cpfsValidos.includes(cpf.replace(/\D/g, ""))) {
      return {
        success: true,
        data: {
          cpf: formatCPF(cpf),
          nome: "Cliente Exemplo",
          mae: "Mãe Exemplo",
          data_nascimento: "1990-01-01",
          status: "Ativo",
          encomenda: {
            codigo: `BR${Math.random().toString().substring(2, 11)}BR`,
            status: "Em trânsito",
            produto: "Encomenda Internacional",
            valor: "37,90",
          },
        },
      }
    }

    return {
      success: false,
      message: "Erro de conexão. Tente novamente mais tarde.",
    }
  }
}

// Função para testar a conexão com a nova API
export async function testarConexaoAPI(): Promise<{
  success: boolean
  message: string
}> {
  try {
    // Testar com um CPF de exemplo
    const url = "https://apela-api.tech/?user=9621f314-a0dc-4939-8d89-05dc2317afa0&cpf=12345678900"
    const response = await fetch(url, {
      method: "GET",
    })

    if (response.ok) {
      return {
        success: true,
        message: "Conexão com a API estabelecida com sucesso.",
      }
    }

    return {
      success: false,
      message: "Erro ao conectar com a API.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Erro de conexão com a API.",
    }
  }
}
