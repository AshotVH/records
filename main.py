from flask import Flask, Response, send_file, request, render_template,redirect, url_for, session, flash
import requests
import os
import time
import io
import base64
import logging

app = Flask(__name__)
logger = logging.getLogger(__name__)
PASSWORD = os.environ.get("PASSWORD")
app.secret_key = os.environ.get("SECRET_KEY", "secret")
API_ADDRESS = os.environ.get("API_ADDRESS")
def is_logged_in():
    return session.get("logged_in")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == PASSWORD:
            session['logged_in'] = True
            return redirect(url_for('index'))
        else:
            time.sleep(1)
            flash('Incorrect password', 'error')
            return redirect(url_for('login'))
    else:
        if is_logged_in():
            return redirect(url_for('index'))
        else:
            return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/')
def index():
    if is_logged_in():
        return render_template('index.html')
    else:
        return redirect(url_for('login'))

@app.route('/np04_get_files_list/<cam_name>/<start_date>/<end_date>')
def np04_get_files_list(cam_name, start_date, end_date):
    response = requests.get(f"{API_ADDRESS}/np04_get_files_list/{cam_name}/{start_date}/{end_date}")
    return response.json()

@app.route('/np04_get_file/<file_path>')
def np04_get_file(file_path):
    response = requests.get(f"{API_ADDRESS}/np04_get_file/{file_path}")
    if response.status_code == 200:
        file_content = response.content
        encoded_content = base64.b64encode(file_content)
        return Response(encoded_content, mimetype='text/plain')
    else:
        return Response("File not found", status=404)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
