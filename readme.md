# Stock Helper
An app made to help investors/traders by providing stock predictions and transcript summarization  
## Features
- **Stock Prediction models:** The website features a stock prediction model which can help in predicting future stock prices. 
- **Summarized Transcripts:** The Website provides a summarized transcript of the quaterly fiscal meeting.
- **User-Friendly Interface:** The website features a clean and intuitive user interface that is easy to navigate, with clear menus, search functionality, and customizable settings. It is designed to provide a seamless user experience, whether users are beginners or experienced investors/traders.
## Technologies Used

-   Front-end: ReactJS
-   Back-end: Python, Django, Pytorch
-   APIs: Stock market data APIs for real-time stock data and financial information

## Steps to Run

### Locally Hosting Backend
In "Backend" Directory
- Create a virtual environment if needed using:

       py -m venv .venv
    
- Activate virtual environment.

	    .venv/Scripts/activate.bat //In CMD  
	    .venv/Scripts/Activate.ps1 //In Powershell

- install requirements

      pip install -r requirements.txt

- run server
    change directory to \stocks
    `python manage.py runserver`
### Locally Hosting frontend
- In "Frontend" Directory

- Run

	     npm i 
		 npm start

Webapp should be running at localhost:3000
