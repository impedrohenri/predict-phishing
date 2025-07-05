import { Routes } from "react-router"
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [importancia, setImportancia] = useState({})
  const [data, setData] = useState({})

  useEffect(() => {
    document.title = "teste "

    const formData = new FormData();
    formData.append("url", "https://google.com/");

    fetch("http://127.0.0.1:5000/", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => { console.log(data); setImportancia(data.importancia_features); setData(data) })
  }, [])

  const ordenado = Object.entries(importancia).sort((a, b) => a[1] - b[1]);

  return (
    <div className="App">
      <h1>{data.valor} -{data.probabilities} </h1>
      <div>
      <h2>Importância das Features</h2>
      <ul>
        {ordenado.map(([nome, valor]) => (
          <li key={nome}>
            <strong>{nome}:</strong> {valor}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default App;
