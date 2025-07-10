import dict from '../data/featuresDictionary.json';

export default function FeatureDescription({textoDestaque, setTextoDestaque, url}) {
    return (
        <div className="bg-white rounded-5 shadow-md overflow-hidden transition-all hover:shadow-lg">

            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-100">
                <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Como interpretar os resultados
                </div>
            </div>

            <div className="p-6 space-y-8">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Próximos passos</h3>
                            <p className="text-gray-600 mt-1">
                                Se a URL foi classificada como <span className="font-medium text-red-500">phishing</span>, recomendamos:
                            </p>
                            <ol className="mt-3 space-y-2 pl-5 list-decimal text-gray-700">
                                <li className="pl-2">Não inserir nenhuma informação pessoal</li>
                                <li className="pl-2">Verificar o domínio cuidadosamente</li>
                                <li className="pl-2">Usar autenticação de dois fatores</li>
                                <li className="pl-2">
                                    Reportar o site às autoridades competentes
                                    <span className="ml-2 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded">Importante</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">O que significa cada fator?</h3>
                            <ul className="space-y-4 ps-0">
                                {dict.map((feat) => (
                                    <li key={feat.id} className="d-flex flex-column p-4 bg-gray-50 rounded-lg transition-colors" >
                                        <span className="block font-medium text-gray-900">{feat.title}</span>
                                        <span className="block text-gray-600 mt-1">{feat.description}</span>
                                        {feat.textoDestaque.length > 0 && feat.textoDestaque[0] !== "" && <button className={`ms-auto text-sm fw-bold btn btn-outline-primary mt-2 py-1 rounded-pill`} style={{ cursor: 'pointer'}} onClick={() => {setTextoDestaque(feat.textoDestaque)}} disabled={!url.includes(feat.textoDestaque[0])}>Visualizar na URL</button>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}