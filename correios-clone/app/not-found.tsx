import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-2 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="https://consulta-envios-online.com/">
                <Image
                  src="/correios-logo.png"
                  alt="Correios"
                  width={300}
                  height={60}
                  className="h-8 w-auto"
                  priority
                />
              </Link>
            </div>
            <div className="text-xs">
              <Link href="#" className="text-blue-600 hover:underline">
                Acessibilidade
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Página não encontrada</h1>
          <p className="text-gray-600 mb-6">
            O conteúdo que você está procurando não foi encontrado ou não está disponível.
          </p>
          <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
            Voltar para a página inicial
          </Link>
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
