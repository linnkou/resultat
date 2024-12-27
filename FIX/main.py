from flask import Flask, render_template, send_from_directory
import os

from app_init import app
import app as app_routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

if __name__ == '__main__':
    app_routes.initialize()
    app.run(host='0.0.0.0', port=8080)