import React, { useState } from 'react';

/**
 * Componente que destaca palavras ou frases específicas dentro de um texto.
 * 
 * Props:
 * - texto: string com o texto original
 * - palavrasAlvo: array de strings (palavras/expressões a destacar)
 * - cor: classe CSS opcional (ex: "text-red-500", "bg-yellow-200")
 */
const TextoComPalavrasDestacadas = ({ texto, palavrasAlvo = [], cor = "text-red-500" }) => {
  const [destacar, setDestacar] = useState(true);

  const toggleDestaque = () => setDestacar(!destacar);

  const getRegex = () => {
    const escaped = palavrasAlvo
      .map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .sort((a, b) => b.length - a.length); // evita matches curtos antes dos longos

    return new RegExp(`(${escaped.join('|')})`, 'gi');
  };

  const renderTexto = () => {
    if (!palavrasAlvo.length || !destacar) return texto;

    const partes = texto.split(getRegex());

    return partes.map((parte, i) => {
      const match = palavrasAlvo.find(p =>
        parte.toLowerCase() === p.toLowerCase()
      );

      return match ? (
        <span key={i} className={cor}>
          {parte}
        </span>
      ) : (
        <span key={i}>{parte}</span>
      );
    });
  };

  return (
    <div>
      <p className="text-lg">{renderTexto()}</p>
    </div>
  );
};

export default TextoComPalavrasDestacadas;
