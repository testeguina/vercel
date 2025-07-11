import { NextResponse } from "next/server"
import { testarConexaoAPI } from "@/lib/cpf-api"

export async function GET() {
  try {
    const result = await testarConexaoAPI()

    return NextResponse.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
