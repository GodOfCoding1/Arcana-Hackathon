from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
import csv
import os
from datetime import datetime
from price.predict_with_model import predict,predict_many
from price.make_model import make_model

basepath="price"

class CSVView(viewsets.ViewSet):
    def list(self, request):
        symbol=request.query_params.get("symbol",None)
        from_date=list(map(int,request.query_params.get("from",None).split("-")))
        to_date=list(map(int,request.query_params.get("to",None).split("-")))
        filepath=basepath+"/data/"+symbol+".csv"
        with open(filepath, 'r') as csvfile:
            csvreader = csv.reader(csvfile)
            # extracting field names through first row
            next(csvreader)
            # extracting each data row one by one
            start=False
            res=[]
            
            for row in csvreader:
                date,_,close,_=row
                if date=="ds":
                    continue
                date=list(map(int,date.split("-")))
                if not start and datetime(date[0],date[1],date[2])>=datetime(from_date[0],from_date[1],from_date[2]):
                    start=row[0]
                if start:
                    res.append({"value":close,"date":row[0]})
                if datetime(date[0],date[1],date[2])>=datetime(to_date[0],to_date[1],to_date[2]):
                    break
            predictedData=predict_many(symbol,start,len(res))
            for i in range(len(res)):
                res[i]["predictedValue"]=predictedData[i][0]
            return Response(res)
class CheckModel(viewsets.ViewSet):
    def list(self, request):
        symbol=request.query_params.get("symbol",None)
        if not symbol:
            return Response("true") 
        if not (os.path.exists(basepath+"/pt_models/"+symbol+".pt")):
            return Response("false")
        return Response("true")            

class Predict(viewsets.ViewSet):
    def list(self, request):
        symbol=request.query_params.get("symbol",None)
        date=request.query_params.get("date",None)
        days=int(request.query_params.get("days",None))
        if not (os.path.exists(basepath+"/pt_models/"+symbol+".pt")):
            make_model(symbol)
        return Response(predict(symbol,date,days))    
        
