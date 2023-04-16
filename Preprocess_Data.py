# importing libraries
import numpy as np
import pandas as pd
import os

#defining paths
BasePath = ".\\"
Transcript_Path = BasePath + "fmp-transcripts\\FMP"
Data_Path = BasePath + 'prices'
Preprocess_store_Path = BasePath + "Data\\"

# Making List of required symbols 
Symbol_List = os.listdir(Transcript_Path)
Symbol_List.sort()

#Preprocessing Data
for dirname, _, filenames in os.walk(Data_Path):
    for filename in filenames:
        filepath = os.path.join(dirname, filename).replace("\\","/")
        data = pd.read_csv(filepath)
        data = data.sort_values(by = ['symbol','ds'])
        data.head()
        data = data.dropna()
        Symbol_inCSV = data.symbol.unique()
        for i in Symbol_List:
            #Checking If Symbol is present in CSV
            if i in Symbol_inCSV:
                tempdata = data[data['symbol'] == i]
                tempdata.to_csv(Preprocess_store_Path.replace("\\","/")+i+'.csv', mode='a', index=False, header=False)


