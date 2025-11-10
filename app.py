from flask import Flask, render_template
from flask import request, jsonify
import json


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calc', methods=['POST'])
def calc():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Nenhum dado recebido"}), 400

    print("Recebido:", data)

    try:
        distancia = float(data.get('distancia', 0))
        frequencia = float(data.get('frequencia', 0))
        veiculo = float(data.get('veiculo', 0))
        combustivel = float(data.get('combustivel', 0))
        emissao = distancia * frequencia * veiculo * combustivel / 1000
        credito = emissao * 26.5
        arvores = emissao * 40 * 12
        
        resultado = [emissao, credito, arvores]
        print(resultado)

        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
