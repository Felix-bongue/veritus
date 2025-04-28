    import React from 'react'
    import { Link } from 'react-router-dom'
    import { 
      DocumentTextIcon, 
      ChatBubbleLeftRightIcon, 
      CalendarIcon, 
      DocumentArrowUpIcon 
    } from '@heroicons/react/24/outline'

    const benefits = [
      {
        title: 'IA Jurídica',
        description: 'Consultoria jurídica inteligente baseada em leis angolanas',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        title: 'Gestão de Documentos',
        description: 'Organize e acesse seus documentos jurídicos com facilidade',
        icon: DocumentTextIcon,
      },
      {
        title: 'Agenda Integrada',
        description: 'Gerencie seus compromissos e audiências',
        icon: CalendarIcon,
      },
      {
        title: 'Conversores',
        description: 'Converta fotos em PDF e áudio em texto',
        icon: DocumentArrowUpIcon,
      },
    ]

    const LandingPage: React.FC = () => {
      return (
        <div className="min-h-screen bg-white">
          {/* Hero Section */}
          <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                  <div className="sm:text-center lg:text-left">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                      <span className="block xl:inline">Veritus</span>{' '}
                      <span className="block text-indigo-600 xl:inline">SaaS Jurídico</span>
                    </h1>
                    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                      Plataforma completa para advogados angolanos com IA integrada, gestão de documentos e muito mais.
                    </p>
                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                      <div className="rounded-md shadow">
                        <Link
                          to="/register"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                        >
                          Comece Grátis
                        </Link>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Benefícios</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  Tudo que você precisa em um só lugar
                </p>
              </div>

              <div className="mt-10">
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                  {benefits.map((benefit) => (
                    <div key={benefit.title} className="relative">
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                        <benefit.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-16">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{benefit.title}</h3>
                        <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    export default LandingPage
