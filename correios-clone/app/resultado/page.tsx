import type { Metadata } from "next"
import { notFound } from "next/navigation"
import ClientResultPage from "./client-result-page"

export const metadata: Metadata = {
  title: "Resultado do Rastreamento | Correios",
  description: "Detalhes do seu rastreamento",
}

export default async function ResultadoPage({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id

  if (!id) {
    notFound()
  }

  // Renderizar componente do cliente que pode acessar localStorage
  return <ClientResultPage cpfId={id} />
}
