import streamlit as st
import speech_recognition as sr
import io
import wave
from dotenv import load_dotenv
import os
import requests
import time
import threading

load_dotenv(override=True) 

API_URL = "{}/function-calling/generate".format(os.getenv("BACKEND_ENDPOINT"))
headers = {
    "ngrok-skip-browser-warning": "true",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36"
}
wakeword_token = ""

login_res = requests.post("{}/login".format(os.getenv("BACKEND_ENDPOINT")), json={
    'username': os.getenv("USERNAME"),
    'password': os.getenv("PASSWORD"),
}, headers=headers).json()

if login_res.status_code == 200:
    login_data = login_res.json()
    headers["Authorization"] = f"Bearer {login_data.get('access_token')}"
else:
    raise Exception(f"Login failed: {login_res.status_code} - {login_res.text}")


st.title('Device Control by Speech')

def send_to_api(text: str):
    try:
        response = requests.post(API_URL, json={"msg": text, "wakeword_token": wakeword_token}, headers=headers)
        response = response.json()
        wakeword_token = response.get("wakeword_token", "")
        return response
    except Exception as e:
        print(f"Lỗi khi gửi đến API: {e}")
        return False


def recognize_speech(audio_bytes):
    recognizer = sr.Recognizer()

    try:
        # Convert audio_bytes to WAV format
        with wave.open(io.BytesIO(audio_bytes), "rb") as audio_file:
            audio_data = sr.AudioData(audio_bytes, audio_file.getframerate(), audio_file.getsampwidth())

        # Recognize speech
        text = recognizer.recognize_google(audio_data, language="vi-VN")
        return text
    except sr.UnknownValueError:
        return "Could not understand the audio."
    except sr.RequestError as e:
        return f"Recognition error: {e}"


audio_file = st.audio_input("Record your command")

if audio_file:
    audio_bytes = audio_file.read()

    # Convert audio to text
    command = recognize_speech(audio_bytes)
    if command == "Could not understand your command, try again.":
        st.write(command)
    else:
        st.write(f"**Your command:** {command}")

        progress_container = st.empty()
        status_container = st.empty()
        
        api_complete = threading.Event()
        response = [None] 
        
        def api_thread():
            response[0] = send_to_api(command)
            api_complete.set()
        
        thread = threading.Thread(target=api_thread)
        thread.start()
        
        progress = 0
        while not api_complete.is_set():
            progress = min(progress + 1, 90)
            with progress_container.container():
                st.progress(progress/100, text=f"Processing your command... ({progress}%)")
            time.sleep(0.2) 
        
        with progress_container.container():
            st.progress(1.0, text="Processing complete! (100%)")
        progress_container.empty()
        status_container.empty()

        if type(response[0]) == dict and 'assistant' in response[0].keys():
            st.write(f"**Assistant:** {response[0]['assistant']}")
            st.write(f"**Calling Result:** {response[0]['calling_result']}")
        else:
            print(type(response[0]))
            print(response[0])
            st.write("Try again please")
