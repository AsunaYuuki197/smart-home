import speech_recognition as sr
import requests

API_URL = "https://<>.com/function-calling/generate"
USER_ID = 1

def send_to_api(text: str):
    headers = {
        "ngrok-skip-browser-warning": "true",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36"
    }
    try:
        response = requests.post(API_URL, json={"user_id": USER_ID, "msg": text}, headers=headers)
        print(f"API Response: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Lỗi khi gửi đến API: {e}")

def recognize_speech():
    recognizer = sr.Recognizer()
    mic = sr.Microphone()

    with mic as source:
        print("Đang điều chỉnh tiếng ồn môi trường...")
        recognizer.adjust_for_ambient_noise(source)
        print("Đang lắng nghe...")

        while True:
            try:
                audio = recognizer.listen(source)
                print("Đang nhận diện...")
                text = recognizer.recognize_google(audio, language="vi-VN")
                print(f"Nhận diện: {text}")

                send_to_api(text)

            except sr.UnknownValueError:
                print("Không thể nhận diện âm thanh.")
            except sr.RequestError as e:
                print(f"Lỗi khi yêu cầu kết quả từ dịch vụ nhận diện; {e}")
            except KeyboardInterrupt:
                print("\nĐã thoát.")
                break

if __name__ == "__main__":
    recognize_speech()
