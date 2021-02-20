from flask import Flask, render_template, send_file
from flask_cors import *

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/model.json")
def model():
    return render_template(r"./model.json")

@app.route("/group1-shard1of1.bin")
def shared():
    return send_file(r"templates/group1-shard1of1.bin")

if __name__ == '__main__':
    app.run(host="127.0.0.1", port=80)
