import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, cpf } = await request.json()

    // Chaves da AnubisPay
    const ANUBISPAY_PUBLIC_KEY = "pk_S2e-cVWYqxruezJloUjTUFDR6UfW-B60I_jCM2zNx_t_K8yL"
    const ANUBISPAY_SECRET_KEY = "sk_oEkj7R7E8mVI_cWA1IAdb9Na2q6S5Gzz3dR1fWNuf9MMKXL9"

    // Gerar token de autenticação Basic Auth conforme documentação
    const authToken = Buffer.from(`${ANUBISPAY_PUBLIC_KEY}:${ANUBISPAY_SECRET_KEY}`).toString("base64")

    // Dados para a API AnubisPay
    const pixData = {
      amount: 3790, // R$ 37,90 em centavos
      paymentMethod: "pix",
      items: [
        {
          title: "ebook",
          unitPrice: 3790,
          quantity: 1,
          tangible: false,
        },
      ],
      customer: {
        name: name || "Cliente Teste",
        email: email || "cliente@teste.com",
        phone: phone || "11999999999",
        document: {
          number: cpf?.replace(/\D/g, "") || "12345678901",
          type: "cpf",
        },
      },
    }

    // Fazer a chamada para a API AnubisPay
    const response = await fetch("https://api.anubispay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify(pixData),
    })

    const result = await response.json()

    if (response.ok && result.pix && result.pix.qrcode) {
      return NextResponse.json({
        success: true,
        qrcode: result.pix.qrcode,
        transactionId: result.id,
        expirationDate: result.pix.expirationDate,
      })
    } else {
      console.error("Erro na API AnubisPay:", result)

      return NextResponse.json(
        {
          success: false,
          error: "Erro ao gerar PIX",
          details: result,
        },
        { status: response.status || 500 },
      )
    }
  } catch (error) {
    console.error("Erro ao gerar PIX:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
