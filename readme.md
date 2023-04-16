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

## Model Details
-   LSTM model
-   Price Prediction Model is Trained on 80% of the data.
-   Unique model for each stock
-   Tech used: Pytorch

### Key points
- `backend/stocks/price/make_model.py` used to make models
- `backend/stocks/price/predict_with_model.py` used to predict price
- Data was preprocessed using the file `Preprocess_Data.py`
- Transcripts were summarized using `Summarize_Transcript.py`

## Steps to Run
### 1) Locally Hosting Backend
In "Backend" Directory
- Create a virtual environment if needed using:

       py -m venv .venv
    
- Activate virtual environment.

	    .venv/Scripts/activate.bat //In CMD  
	    .venv/Scripts/Activate.ps1 //In Powershell

- install requirements

     	 pip install -r requirements.txt


- Running backend server
    change directory to \stocks	then do 

  	  python manage.py runserver
    
### 2) Locally Hosting frontend
- In "Frontend" Directory do

-
	     npm i 
		 npm start


- Webapp should be running at localhost:3000

### 3) Select a stock by searching for its symbol on the search bar on the top left
