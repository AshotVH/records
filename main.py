from flask import Flask, Response, stream_with_context, request, render_template,redirect, url_for, session, flash
import requests
import os
import time
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
        # response = requests.get(f"{API_ADDRESS}/folders")
        # data = response.json()
        return render_template('index.html')
    else:
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
