import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import dict from '../data/featuresDictionary.json'
import FeatureDescription from '../components/FeatureDescription';

// Configuração do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PhishingDetector = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    document.title = "¿estoy seguro?"

    const analyzeUrl = (event) => {
        event.preventDefault();
        setLoading(true)
        const formData = new FormData(document.getElementById('formURL'));
        console.log(dict)
        console.log(dict[0])
        console.log(dict[0].ti)


        fetch("http://127.0.0.1:5000/", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => { setAnalysis(data); setLoading(false) })
            .catch(err => { console.error(err); setError(err) });
    };

    const getChartData = () => {
        if (!analysis?.importancia_features) return null;

        // Primeiro criamos um mapa do dicionário para acesso rápido
        const featureMap = {};
        dict.forEach(item => {
            featureMap[item.feat_name] = item.title;
        });

        const features = Object.entries(analysis.importancia_features)
            .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Ordena por importância absoluta
            .slice(0, 10); // Pega as 10 mais relevantes

        return {
            labels: features.map(([key]) => featureMap[key] || key), // Usa o título do dicionário ou o nome original
            datasets: [{
                label: 'Importância',
                data: features.map(([, value]) => value),
                backgroundColor: features.map(([, value]) =>
                    value > 0 ? 'rgba(255, 38, 38, 0.85)' : 'rgba(16, 185, 129, 0.7)'
                ),
                borderColor: features.map(([, value]) =>
                    value > 0 ? 'rgba(255, 38, 38, 1)' : 'rgba(16, 185, 129, 1)'
                ),
                borderWidth: 1
            }]
        };
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const label = ctx.dataset.label || '';
                        const value = ctx.raw > 0 ?
                            `Aumenta risco em ${Math.abs(ctx.raw).toFixed(2)}` :
                            `Reduz risco em ${Math.abs(ctx.raw).toFixed(2)}`;
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6B7280' }
            },
            y: {
                grid: { color: '#E5E7EB' },
                ticks: { color: '#6B7280' }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-300 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Detector de Phishing</h1>
                    <p className="text-lg text-gray-600">
                        Analise URLs para identificar possíveis ameaças de phishing
                    </p>
                </div>


                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="space-y-4">
                        <form onSubmit={analyzeUrl} id='formURL'>
                            <div>
                                <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                                    URL para análise
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="url"
                                        id="url-input"
                                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="https://exemplo.com"
                                        name='url'
                                    />
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analisando...
                                            </>
                                        ) : 'Analisar'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resultados da análise */}
                {analysis && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Resultado da Análise</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">URL analisada</p>
                                        <p className="mt-1 text-sm text-gray-900 break-all">{analysis.url}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Classificação</p>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${analysis.valor === 'Phishing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {analysis.valor}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Confiança</p>
                                        <div className="mt-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full ${analysis.valor === 'Phishing' ? 'bg-red-600' : 'bg-green-600'
                                                        }`}
                                                    style={{ width: `${analysis.probabilities}%` }}
                                                ></div>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-700 text-right">
                                                {analysis.probabilities}% de probabilidade
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="bg-white rounded-xl shadow-md overflow-hidden px-6 py-5 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Fatores Determinantes</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Principais características que influenciaram o resultado
                            </p>

                            <div className="p-6">
                                <div className="h-100">
                                    {getChartData() && (
                                        <Bar data={getChartData()} options={chartOptions} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <FeatureDescription />

                    </div>
                )}
            </div>
        </div>
    );
};

export default PhishingDetector;