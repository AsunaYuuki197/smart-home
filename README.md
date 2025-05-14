# Smart Home

In the era of rapid technological development, the demand for automation in daily life is increasing. Smart Home is an inevitable trend that helps improve quality of life, optimize energy usage, and enhance security. With the combination of Artificial Intelligence (AI) and the Internet of Things (IoT), smart homes can automatically adjust devices, save energy, and ensure security. Therefore, the research team has decided to choose this topic to study and develop a modern and efficient smart home system.

<p align="center">
  <img src="homescreen.png" alt="demo" width="900"/>
</p>


<!-- ## Features of this Project

**1.** Turn On/Off Fan/Light, Change Fan Speed, Change Light Color, Change Light Level. (scalable for each location.)

**2.** Turn On/Off Fan/Light, Change Fan Speed, Change Light Color, Change Light Level By AI Model (Opensoure HuggingFace Model or Gemini API), based on Voice Command.

**3.** Sensor (Humidity & Temperature Sensor, Light Sensor) Data Collection and Visualize.

**4.** Visualize Fan/Light Usage (Time Usage, Activity History), support Filtering by Week/Month and Time Range.

**5.** Display and Search Notifications.

**6.** Turn On/Off Sending Fire or Hot Notifications when temperature or humidity collected from sensor exceed the threshold, Allow to Set Up Hot temperature threshold. 

**7.** Support Push Notifications via Website (frontend), Devices (Pop-up on device), and Email. (Scalable to Push Million Notifications for Million Devices)

**8.** Auto Turn On/Off Pump when temperature exceed Fire threshold 

**9.** Turn On/Off and Set up Time to Back to Automatic Mode - Devices are controlled automatic based on the rule. 

**10.** Turn On/Off Motion Dectect for Auto Turn On/Off Light when detect the motion or not.

**11.** Set Up Time Range and Repeat (num of days) for Auto Turn On/Off Light/Fan.

**12.** Auto Turn On/Off Fan at Specific Level based on Humidity & Temperature collected from sensor exceed the threshold. You also can set the Humidity & Temperature Threshold, and Fan Level in Optional Mode

**13.** Auto Turn On/Off Light at Specific Level and Color based on Light Intensity collected from sensor exceed the threshold. You also can set the Light Intensity Threshold, and Light Level/Color in Optional Mode

**14.** Pause Auto Mode when User do the manual controlling, and Resume Auto Mode after the setting Time to Back.

**15.** Set Up Wake Word for start up AI (when Using Voice Command).

**16.** Allow to add more [HuggingFace Models](https://huggingface.co/models) that support Function Calling, or Gemini API.

**17.** Login/Signup/Logout

**18.** Change/View Profile

We built all above features that can scalable for the increasing user with less modifications. -->

## Key Features

### Device Control
1. Control fan and light:
   - Turn On/Off
   - Adjust fan speed
   - Change light color
   - Set light brightness level  
   *(Device control is scalable for each location.)*

2. AI-based control using voice commands:
   - Supported by open-source models (e.g., HuggingFace) or Gemini API.
   - Control fan/light actions through natural voice input.

---

### Sensor Integration & Visualization
3. Real-time data collection from:
   - Humidity and temperature sensors
   - Ambient light sensors

4. Visualization of:
   - Fan and light usage over time
   - Activity history  
   *(Supports filtering by week, month, or custom time range)*

---

### Notifications System
5. View and search device/system notifications

6. Fire or heat alert system:
   - Enable/disable notifications for high temperature or humidity
   - Set custom heat temperature thresholds

7. Push notification support:
   - Website (frontend alerts)
   - Device pop-ups
   - Email notifications  
   *(Scalable to millions of devices)*

---

### Automation Rules
8. Auto-activate water pump when fire-temperature threshold is exceeded

9. Automatic mode scheduling:
   - Set specific times to return devices to auto-mode after manual overrides

10. Motion detection:
   - Automatically turn on/off lights based on motion detection

11. Scheduled automation:
   - Set up time ranges and repetition intervals (e.g., every X days) to automate fan/light actions

12. Humidity & temperature-based fan control:
   - Automatically turn fan on/off at specific speed levels when thresholds are exceeded
   - Thresholds and fan speed settings are configurable in optional mode

13. Light intensity-based light control:
   - Automatically adjust light color and brightness when intensity exceeds threshold
   - Threshold and light settings are configurable in optional mode

14. Auto-mode behavior:
   - Pause automation during manual control
   - Automatically resume automation after a configured delay

---

### AI & Voice Interaction
15. Configurable wake word for activating AI-based voice commands

16. Extendable AI model support:
   - Easily integrate additional [HuggingFace models](https://huggingface.co/models) with function calling
   - Gemini API support

---

### User Account Management
17. User authentication:
   - Login / Signup / Logout

18. Profile management:
   - View and update user profile

---

## Scalability

This system is designed with scalability in mind. All features are implemented in a modular and extensible way to support growing numbers of users and devices with minimal changes.

---

## Technology Stack
- Front-end: Next.js, React, Tailwind, ChartJS
- Back-end: FastAPI, Uvicorn
- Database: MongoDB
- Task Queue: Redis, Celery
- Notifications: Firebase
- Server Deploy: Kaggle, Ngrok
- Client Deploy: Render

## Installation
To use the application, you can follow the following steps:


### Pre-Requisites:
1. Install Git Version Control
[ https://git-scm.com/downloads ]

2. Install Python (v3.12.1 recommended)
[ https://www.python.org/downloads/ ]

3. Install Pip (Package Manager)
[ https://pip.pypa.io/en/stable/installation/ ]

4. Install Node.js (v20)
[ https://nodejs.org/en/download ]



### Installation
**1. Create a Folder where you want to save the project**

**2. Create a Virtual Environment and Activate**

Install Virtual Environment First
```
pip install virtualenv
```

Create Virtual Environment

For Windows
```
python -m venv venv
```
For Mac
```
python3 -m venv venv
```
For Linux
```
virtualenv .
```

Activate Virtual Environment

For Windows
```
venv\Scripts\activate
```

For Mac
```
source venv/bin/activate
```

For Linux
```
source bin/activate
```

**3. Clone this project**

Open a terminal at a directory of your choice and enter these commands (change the folder name if you want to):
```
  git clone https://github.com/AsunaYuuki197/smart-home.git
  cd smart-home
```

Inside **smart-home** folder, you will see several subfolders: *frontend*, *backend*, etc.

### Install dependencies

You will have to install all the dependencies of our project. Let's go to the "backend" directory first and **read the README** for more information:
```
  cd backend
```

Then, go to the "frontend" directory and do the same thing by entering these commands:
```
  cd frontend
  npm install
```

You have installed all the dependencies.

### Set up Mongodb database

We are using [Mongodb Atlas](https://cloud.mongodb.com/), if you want to use this platform, you can follow this instructions [Mongodb Atlas docs](https://www.mongodb.com/docs/atlas/) to create cluster, otherwise follow your chosen platform instructions. For the structure of the database, you can refer the entire_database.json.

## Run the application

### Create .env file and Import service key.

**1. .env file**
```shell
# FEED KEY - You can get this from Adafruit
AIO_USERNAME = ""
AIO_KEY = ""
FAN_BTN_FEED = ""
FAN_SPEED_FEED = ""
HUMIDITY_FEED = ""
TEMPERATURE_FEED = ""
LIGHT_BTN_FEED = ""
LIGHT_COLOR_FEED = ""
LIGHT_LEVEL_FEED = ""
LIGHT_SENSOR_FEED = ""
PUMP_FEED = ""
DETECT_BTN_FEED = ""

# DB KEY - MongoDB password and username
DB_PWD = ""
DB_NAME = ""

# BACKEND_ENDPOINT - https://localhost:8000 (local) or your deployed backend endpoint.
BACKEND_ENDPOINT = "https://localhost:8000"

# GEMINI API - You can get this in https://aistudio.google.com/ 
GEMINI_KEY = ""

# Firebase Cloud Messaging - read the 'Get the Google Service Account' part.
Firebase_ServiceAccountKEY =../serviceAccountKey.json

# Redis - The Redis host/port and user password
Redis_HOST = ""
Redis_PORT = ""
Redis_PW = ""

# Web login credentials - This is for using stt_client / Device Controling by Voice using AI
USERNAME = ""
PASSWORD = ""

# Email Sender Information - For notify via email, you can use gmail account, and apppw from https://myaccount.google.com/apppasswords  
SENDER_EMAIL = ""
SENDER_APPPW = ""
```


**2. Get the Google Service Account**

- Create a Firebase and Register your web app [https://firebase.google.com/docs/web/setup?continue=https%3A%2F%2Ffirebase.google.com%2Flearn%2Fpathways%2Ffirebase-web%23article-https%3A%2F%2Ffirebase.google.com%2Fdocs%2Fweb%2Fsetup#create-firebase-project-and-app]

- Go to Storage options in Firebase and Get started

- Generate a private key file for your service account [https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments]

- Place the serviceAccountKey.json in smart-home folder

### Start each folder separately
Start three terminal instances in the **smart-home** directory. For the first instance, run these commands:

For Windows:
```
  celery -A background.tasks worker --loglevel=info --pool=gevent --concurrency=10
```

For Linux/MacOS:
```
  celery -A background.tasks worker --loglevel=info
```

For the second one, run these commands:
```
  cd backend
  python server.py
```

For the third one, run these commands:
```
  cd frontend
  npm run dev  
```

The application should be starting. The ReactJS application will run on http://localhost:3000 and the FastAPI application will run on http://localhost:8000.

To login:
* Username: `admin@gmail.com`
* Password: `123456`

You are now ready to explore our application!

<!-- ### Or use our web deployment 😀 
The application is running in [Link to the website](....)

To login:
* Username: `admin`
* Password: `123456`

You are now ready to explore our application! -->

## Voice-based device control using AI

AI would control your device, but you need to speak your command, what will handle your speak, and how can you run this feature, ```cd stt_client``` and **Read the README** 


## Contributor
Our members of the team:
* Nguyễn Khắc Duy - 2210517
* Nguyễn Quang Huy - 2211234
* Đào Ngọc Minh - 2212023
* Kiều Tâm Hậu - 2210961
* Nguyễn Trọng Tài - 2212995
