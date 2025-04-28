    import React, { useState } from 'react'
    import { useQuery } from 'react-query'
    import { 
      DocumentTextIcon, 
      ChatBubbleLeftRightIcon, 
      CalendarIcon, 
      DocumentArrowUpIcon 
    } from '@heroicons/react/24/outline'

    const Dashboard: React.FC = () => {
      const [selectedFeature, setSelectedFeature] = useState<string>('ia')

      const features = {
        ia: {
          title: 'Consultoria IA',
          icon: ChatBubbleLeftRightIcon,
          component: <IAConsultation />
        },
        documentos: {
          title: 'Documentos',
          icon: DocumentTextIcon,
          component: <Documents />
        },
        conversores: {
          title: 'Conversores',
          icon: DocumentArrowUpIcon,
          component: <Converters />
        },
        agenda: {
          title: 'Agenda',
          icon: CalendarIcon,
          component: <Calendar />
        }
      }

      return (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(features).map(([key, feature]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFeature(key)}
                    className={`p-4 rounded-lg shadow ${
                      selectedFeature === key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <feature.icon className="h-6 w-6" />
                    <h3 className="mt-2 text-sm font-medium">{feature.title}</h3>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {features[selectedFeature as keyof typeof features].component}
              </div>
            </div>
          </div>
        </div>
      )
    }

    const IAConsultation: React.FC = () => {
      const [question, setQuestion] = useState('')
      const [answer, setAnswer] = useState('')

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Implement AI consultation
      }

      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Consultoria Jurídica com IA</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={4}
              placeholder="Digite sua pergunta jurídica..."
            />
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Consultar
            </button>
          </form>
          {answer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p>{answer}</p>
            </div>
          )}
        </div>
      )
    }

    const Documents: React.FC = () => {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Documentos</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentArrowUpIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX (MAX. 10MB)</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )
    }

    const Converters: React.FC = () => {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Conversores</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Foto para PDF</h3>
              <input type="file" accept="image/*" className="w-full" />
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Áudio para Texto</h3>
              <input type="file" accept="audio/*" className="w-full" />
            </div>
          </div>
        </div>
      )
    }

    const Calendar: React.FC = () => {
      return (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Agenda</h2>
          <div className="h-96">
            {/* TODO: Implement Google Calendar integration */}
            <p className="text-gray-500">Integração com Google Calendar em desenvolvimento...</p>
          </div>
        </div>
      )
    }

    export default Dashboard
