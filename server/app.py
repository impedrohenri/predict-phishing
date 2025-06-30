import pandas as pd
import numpy as np
from flask import Flask, request
from ai import model, feature_extraction
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# Modelo
ML_model = model.CatBoost_model

@app.route("/", methods=['POST'])
def predict():
    url = request.form['url']
    url_data = feature_extraction.feature_extraction(url)

    valor = ML_model.predict(url_data)
    valor = 'Legitimo' if valor == 0 else 'Phishing'

    probabilities = ML_model.predict_proba(url_data)[0]
    probabilities = f"{np.max(probabilities) * 100:.1f}"
    
    return {
    "url": url,
    "valor": valor,
    "probabilities": probabilities,
    }


if __name__ == '__main__':
    app.run(debug=True)