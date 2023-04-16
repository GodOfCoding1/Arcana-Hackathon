from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
import csv
import os
basepath="transcripts/fmp_calc/FMP"
class CSVView(viewsets.ViewSet):
    def list(self, request):
        symbol=request.query_params.get("symbol",None)
        date=request.query_params.get("date",None)
        json=request.query_params.get("json",None)
        if not symbol:
            return Response(os.listdir(basepath)[1:])
        if not date:
            return Response(os.listdir(basepath+"/"+symbol)[1:])
        if not json:
            return Response(os.listdir(basepath+"/"+symbol+"/"+date))
        filepath=basepath+"/"+symbol+"/"+date+"/"+json
        with open(filepath, 'r') as f:
            return Response(f.read())

