"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const GA_TRACKING_ID = "AW-300775536"

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
    dataLayer: any[]
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", GA_TRACKING_ID, {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Funções para rastrear eventos de conversão
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Eventos específicos para o funil de vendas
export const trackPageView = (page_title: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_title: page_title,
    })
  }
}

export const trackCPFSearch = (cpf: string) => {
  trackEvent("cpf_search", "engagement", "cpf_consulta")
}

export const trackCPFFound = () => {
  trackEvent("cpf_found", "conversion", "cpf_encontrado")
}

export const trackUserConfirmation = () => {
  trackEvent("user_confirmation", "conversion", "sim_sou_eu")
}

export const trackPaymentPageView = () => {
  trackEvent("payment_page_view", "conversion", "pagina_pagamento")
}

export const trackPixGenerated = (value: number) => {
  trackEvent("pix_generated", "conversion", "pix_gerado", value)

  // Evento de conversão específico do Google Ads
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${GA_TRACKING_ID}/conversion_label_here`, // Substitua pelo seu label de conversão
      value: value / 100, // Converter centavos para reais
      currency: "BRL",
    })
  }
}

export const trackFormSubmission = (form_name: string) => {
  trackEvent("form_submit", "engagement", form_name)
}
