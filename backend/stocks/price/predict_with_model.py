import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import datetime
import os
from price.make_model import make_model

input_dim = 1
hidden_dim = 32
num_layers = 2
output_dim = 1
num_epochs = 100
basepath="price"

class LSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, num_layers, output_dim):
        super(LSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).requires_grad_()
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).requires_grad_()
        out, (hn, cn) = self.lstm(x, (h0.detach(), c0.detach())) #2
        out = self.fc(out[:, -1, :]) 
        return out



def predict(symbol , fromday, nday):
   
    saved_model = basepath+"/pt_models/"+symbol+".pt"
    model2 = LSTM(input_dim=input_dim, hidden_dim=hidden_dim, output_dim=output_dim, num_layers=num_layers)
    model2.load_state_dict(torch.load(saved_model))
    filepath = basepath+"/data/"+symbol+".csv"
    data = pd.read_csv(filepath)
    data = data.sort_values('ds')
    data = data[pd.to_numeric(data['close'], errors='coerce').notnull()] 
    yy,mm,dd = list(map(int,fromday.split("-"))) if fromday else list(map(int,data['ds'].iloc[-1].split("-")))

    ind=None
    if not fromday:
        ind=len(data['ds'])-1
    else:
        ind = list(data[data['ds']==fromday].index)
        if len(ind)==0 or ind[0] <= 21:
            print("data not available for predicting")
            return
        ind = ind[0]

    scaler = MinMaxScaler(feature_range=(-1, 1))
    price = data[['close']]
    price['close']= scaler.fit_transform(price['close'].values.reshape(-1,1))
    datamm = []
    data_raw = price.to_numpy()
    datamm.append(data_raw[ind-20: ind+1])

    datamm = np.array(datamm)
    xt = datamm[:,:-1]
    #yt = datamm[:,-1,:]

    currentDate=datetime.datetime(yy,mm,dd) 

    preds = []
    for _ in range(nday + 1):
        xt_torch = torch.from_numpy(xt).type(torch.Tensor)
        yt_got =  model2(xt_torch)
        yt_pred = scaler.inverse_transform(yt_got.detach().numpy())
        yt_pred = float(yt_pred[0])
        preds.append([yt_pred,currentDate])
        currentDate += datetime.timedelta(days=1)
        ind = ind + 1 
        xt = xt.reshape(20)
        xt = np.append(xt,yt_got.detach().numpy())
        xt = np.delete(xt, 0)
        xt = xt.reshape([1,20,1])
    return preds

def predict_many(symbol , fromday, nday):

    if not (os.path.exists(basepath+"/pt_models/"+symbol+".pt")):
            make_model(symbol)
    
    saved_model = basepath+"/pt_models/"+symbol+".pt"
    model2 = LSTM(input_dim=input_dim, hidden_dim=hidden_dim, output_dim=output_dim, num_layers=num_layers)
    model2.load_state_dict(torch.load(saved_model))
    filepath = basepath+"/data/"+symbol+".csv"
    data = pd.read_csv(filepath)
    data = data.sort_values('ds')
    data = data[pd.to_numeric(data['close'], errors='coerce').notnull()]
    #data.head()
    ind = list(data[data['ds']==fromday].index)
    if len(ind)==0 or ind[0] <= 21:
        print("data not available for predicting")
        return
    ind = ind[0]
    #print(ind)
    scaler = MinMaxScaler(feature_range=(-1, 1))
    price = data[['close']]
    price['close']= scaler.fit_transform(price['close'].values.reshape(-1,1))
    datamm = []
    data_raw = price.to_numpy()
    datamm.append(data_raw[ind-20: ind+1])

    datamm = np.array(datamm)
    xt = datamm[:,:-1]
    yt = datamm[:,-1,:]

    preds = []
    for _ in range(nday):
        
        xt_torch = torch.from_numpy(xt).type(torch.Tensor)
        yt_got =  model2(xt_torch)
        yt_pred = scaler.inverse_transform(yt_got.detach().numpy())
        yt_pred = float(yt_pred[0])
        preds.append([yt_pred,data['ds'].iloc[ind]])
        
        xt = xt.reshape(20)
        if(ind<len(price['close'])):
            yt=price['close'].iloc[ind]
            ind = ind + 1 
        else:
            yt=yt_got.detach().numpy()
        xt = np.append(xt,yt)
        xt = np.delete(xt, 0)
        xt = xt.reshape([1,20,1])
    return preds