import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import dict from '../../data/featuresDictionary.json'
import FeatureDescription from '../../components/FeatureDescription';
import TextoComCaracteresColoridos from '../../components/URLDestacada';
import HighlightFeaturesInText from '../../components/URLDestacada';
import TextoComPalavrasDestacadas from '../../components/URLDestacada';

// Configuração do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PhishingDetector = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [textoDestaque, setTextoDestaque] = useState('');
    const URLanalisys = useRef(null);

    useEffect(() => {
        const el = URLanalisys.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                el.classList.toggle("is-pinned", entry.intersectionRatio < 1);
            },
            { threshold: [1] }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [analysis]);



    const analyzeUrl = (event) => {
        event.preventDefault();
        setLoading(true)
        const formData = new FormData(document.getElementById('formURL'));


        try {
            fetch("http://127.0.0.1:5000/", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    setAnalysis(data);
                    setLoading(false);
                })
                .catch(err => { console.error(err); setError(err) });
        } catch (erro) {
            setError(erro);
        }
    };

    const getChartData = () => {
        if (!analysis?.importancia_features) return null;
        const featureMap = {};
        dict.forEach(item => {
            featureMap[item.feat_name] = item.title;
        });

        const invert = analysis.valor === "Legitimo";

        const features = Object.entries(analysis.importancia_features_porcentagem)
            .map(([key, value]) => [key, invert ? -value : value]) // Inverte os valores se for legítimo
            .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
            .slice(0, 10);

        return {
            labels: features.map(([key]) => featureMap[key] || key),
            datasets: [{
                label: 'Importância',
                data: features.map(([, value]) => value),
                backgroundColor: features.map(([, value]) =>
                    value > 0
                        ? (invert ? 'rgba(16, 185, 129, 0.7)' : 'rgba(255, 38, 38, 0.85)')
                        : (invert ? 'rgba(255, 38, 38, 0.85)' : 'rgba(16, 185, 129, 0.7)')
                ),
                borderColor: features.map(([, value]) =>
                    value > 0
                        ? (invert ? 'rgba(16, 185, 129, 1)' : 'rgba(255, 38, 38, 1)')
                        : (invert ? 'rgba(255, 38, 38, 1)' : 'rgba(16, 185, 129, 1)')
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
                        const { raw } = ctx;
                        const valor = Math.abs(raw).toFixed(2);

                        const aumenta = `Aumenta risco em ${valor}%`;
                        const reduz = `Reduz risco em ${valor}%`;

                        // Aplica a lógica do invert
                        const texto = raw > 0
                            ? (analysis.valor === "Legitimo" ? reduz : aumenta)
                            : (analysis.valor === "Legitimo" ? aumenta : reduz);

                        return `${ctx.dataset.label || ''}: ${texto}`;
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
                ticks: {
                    color: '#6B7280',
                    callback: function (value) {
                        return value + '%';
                    }
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Detector de Phishing</h1>
                    <p className="text-lg text-gray-600">
                        Analise URLs para identificar possíveis ameaças de phishing
                    </p>
                </div>


                <div className="bg-white rounded-5 shadow-md p-6 mb-8">
                    <div className="space-y-4">
                        <form onSubmit={analyzeUrl} id='formURL'>
                            <div>
                                <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-1">
                                    Insira a o Link a ser analisado.
                                </label>

                                <InputGroup className="mb-3 rounded-pill fs-6" size="lg">
                                    <Form.Control
                                        className='rounded-start-pill'
                                        placeholder="https://exemplo.com"
                                        name='url'
                                        required
                                    />
                                    <Button className='rounded-end-pill fs-6' variant="primary" id="button-addon2" type='submit'>
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" variant="light" size='sm' className='me-2' />
                                                Analisando...
                                            </>
                                        ) : 'Analisar'}
                                    </Button>
                                </InputGroup>


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

                        <div ref={URLanalisys} className='URL-Analisys bg-black-500'>
                            <span className="label-url text-black-300">URL analisada:</span>
                            <span className='theURL'><TextoComPalavrasDestacadas texto={analysis.url} palavrasAlvo={textoDestaque} cor="text-warning fw-bolder" /></span>
                        </div>


                        <div className={`bg-white rounded-5 shadow-md overflow-hidden rounded-3xl mb-7 ring-4  ${analysis?.valor === 'Phishing' ? 'ring-red-600/40' : 'ring-green-600/40'}`} >
                            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                                <span className="fs-5 font-semibold text-gray-900">Resultado da Análise</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">

                                <div className='col-span-3 text-md'>
                                    <p className="font-medium text-gray-500 mb-2">Classificação</p>
                                    <span className={`inline-flex my-auto items-center px-7 py-1 rounded-full text-lg font-medium ${analysis?.valor === 'Phishing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {analysis?.valor}
                                    </span>
                                </div>

                                <div className='col-span-2'>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Taxa de Probabilidade</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${analysis?.valor === 'Phishing' ? 'bg-red-600' : 'bg-green-600'
                                                }`}
                                            style={{ width: `${analysis?.probabilities}%` }}
                                        ></div>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-700 text-right">
                                        {analysis?.probabilities}% de probabilidade
                                    </p>
                                </div>

                            </div>
                        </div>

                        <div className="bg-white rounded-5 shadow-md overflow-hidden px-6 bg-gray-50 border-b border-gray-200">

                            <div className="fs-5 font-semibold text-gray-900 my-3">Fatores Determinantes</div>

                            <p className="mt-1 text-sm text-gray-500">
                                Exibição gráfica das 10 principais características que influenciaram o resultado
                            </p>

                            <div className="p-6">
                                <div className="h-100">
                                    {getChartData() && (
                                        <Bar data={getChartData()} options={chartOptions} />
                                    )}
                                </div>
                            </div>
                        </div>

                        <FeatureDescription textoDestaque={textoDestaque} setTextoDestaque={setTextoDestaque} url={analysis.url}/>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PhishingDetector;