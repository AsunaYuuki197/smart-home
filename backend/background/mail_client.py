import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os, requests 
from dotenv import load_dotenv
load_dotenv()

# Email credentials
sender_email = os.getenv("SENDER_EMAIL")
password = os.getenv("SENDER_APPPW")
message = MIMEMultipart()

def send_mail(receiver_email, subject, body, headers):
    res = requests.get("{}/autorule/email/sent".format(os.getenv("BACKEND_ENDPOINT")),params={'email': receiver_email},headers=headers)
    if not res.json().get('message',None):
        print(f"Skipping {receiver_email} — sent too recently.")
        return
   
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    # Send the email using Gmail's SMTP server
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            requests.get("{}/autorule/email/record".format(os.getenv("BACKEND_ENDPOINT")),params={'email': receiver_email},headers=headers)

            print("Email sent successfully.")
    except Exception as e:
        print(f"Error: {e}")
