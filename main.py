from flask import Flask, Response, send_file, request, render_template,redirect, url_for, session, flash
import requests
import os
import time
import io
import base64

app = Flask(__name__)

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

@app.route('/get_folders')
def get_folders():
    response = requests.get(f"{API_ADDRESS}/folders")
    return response.json()

@app.route('/files/<folder_name>/<filename>')
def get_file(folder_name, filename):
    response = requests.get(f"{API_ADDRESS}/files/{folder_name}/{filename}")
    status_code = response.status_code
    # Get other information from the response headers
    headers = response.headers
    content_type = headers.get('content-type')
    content_length = headers.get('content-length')
    # Add more headers as needed
    
    # Return the status code and other information as a JSON response
    return {
        'status_code': status_code,
        'content_type': content_type,
        'content_length': content_length
        # Add more response information as needed
    }

    img_base64 = base64.b64encode(response.content)
    return {'image_base64': img_base64}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
