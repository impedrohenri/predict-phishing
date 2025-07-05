import pandas as pd
import numpy as np
from flask import Flask, request
from ai import model, feature_extraction
from flask_cors import CORS
import shap

app = Flask(__name__)
CORS(app) 

# Modelo
ML_model = model.CatBoost_model

features_names = [
    "Quantidade_de_pontos_na_URL",
    "Nível_de_subdomínio",
    "Níveis_no_caminho_da_URL",
    "Comprimento_total_da_URL",
    "Quantidade_de_hifens_na_URL",
    "Quantidade_de_hifens_no_domínio_principal",
    "Símbolo_arroba_em_posição_suspeita",
    "Uso_suspeito_de_til_na_URL",
    "Quantidade_de_sublinhados_na_URL",
    "Número_de_componentes_de_query",
    "Quantidade_de_ampersands_na_URL",
    "Sequências_numéricas_longas",
    "Protocolo_inseguro_ou_ausente",
    "Presença_de_endereço_IP_na_URL",
    "Comprimento_total_do_domínio_registrado",
    "Comprimento_total_do_caminho",
    "Comprimento_total_da_query",
    "Barras_duplas_no_caminho",
    "Número_de_palavras_chave_relacionadas_a_phishing",
    "Uso_de_nomes_de_marcas_embutidos_com_homógrafos",
    "Sequências_repetidas_de_caracteres_ou_números",
    "Entropia_do_domínio_indicando_aleatoriedade",
    "Balanceamento_entre_letras_e_dígitos_no_domínio",
    "Presença_de_extensões_de_arquivos_suspeitas",
    "Palavras_suspeitas_nos_parâmetros_da_query",
    "TLD_associado_a_país_em_vez_de_genérico",
    "Variação_no_tamanho_dos_subdomínios",
    "Segmentos_repetidos_no_caminho_da_URL",
    "Proporção_de_consoantes_em_relacao_ao_domínio",
    "Termos_de_autenticacao_presentes_no_caminho",
    "Quantidade_de_dígitos_no_domínio_principal",
    "Ocorrências_de_strings_ofuscadas_hex_base64_ou_IP_decimal",
    "Pontuação_TF_IDF_baseada_em_caracteres_na_URL"
]


# Inicializa o explicador SHAP (TreeExplainer para CatBoost)
explainer = shap.TreeExplainer(ML_model)

@app.route("/", methods=['POST'])
def predict():
    url = request.form['url']
    url_data = feature_extraction.feature_extraction(url)

    array_features = url_data.iloc[0].to_numpy().reshape(1, -1)

    valor = ML_model.predict(url_data)
    valor = 'Legitimo' if valor == 0 else 'Phishing'

    probabilities = ML_model.predict_proba(url_data)[0]
    probabilities = f"{np.max(probabilities) * 100:.1f}"
    
    # SHAP values (importância local das features para essa predição)
    shap_values = explainer.shap_values(array_features)

    shap_values_sample = shap_values[0]  # shape (33,)

    # Cria o dicionário de importância com os nomes das features
    dict_importancia = {
        features_names[i]: shap_values_sample[i]
        for i in range(len(features_names))
    }

    return {
    "url": url,
    "valor": valor,
    "probabilities": probabilities,
    "importancia_features": dict_importancia
    }



if __name__ == '__main__':
    app.run(debug=True)