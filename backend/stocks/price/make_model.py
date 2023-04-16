
#Import dependencies to pre/post process the data
import numpy as np 
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import math, time
from sklearn.metrics import mean_squared_error

#List available archive data
import os
import torch
import torch.nn as nn

basepath="price"


def split_data(stock, lookback):
    data_raw = stock.to_numpy()
    data = []
    for index in range(len(data_raw) - lookback): 
        data.append(data_raw[index: index + lookback])
    
    data = np.array(data)
    test_set_size = int(np.round(0.2*data.shape[0]))
    train_set_size = data.shape[0] - (test_set_size)
    
    x_train = data[:train_set_size,:-1,:]
    y_train = data[:train_set_size,-1,:]
    
    x_test = data[train_set_size:,:-1]
    y_test = data[train_set_size:,-1,:]
    
    return [x_train, y_train, x_test, y_test]

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

def make_model(symbol):
    #read sbi csv file
    filepath = basepath+'/data/'+ symbol+'.csv'
    data = pd.read_csv(filepath, header=0)
    data = data.sort_values('ds')
    #print some rows
    data.head()
    data = data[pd.to_numeric(data['close'], errors='coerce').notnull()]

    price = data[['close']]
    price['close']

    scaler = MinMaxScaler(feature_range=(-1, 1))
    price['close'] = scaler.fit_transform(price['close'].values.reshape(-1,1))
    print(price.head())
    print(price.shape)

    dataset = price.values

    test_set_size = int(np.round(0.2*price.shape[0]))
    train_set_size = price.shape[0] - test_set_size
    print(test_set_size)
    print(train_set_size)

    train = dataset[0:train_set_size,:]
    print(train.shape)

    test = dataset[train_set_size:,:]
    print(test.shape)
    lookback = 21
    x_train, y_train, x_test, y_test = split_data(price, lookback)
    print('x_train.shape = ',x_train.shape)
    print('y_train.shape = ',y_train.shape)
    print('x_test.shape = ',x_test.shape)
    print('y_test.shape = ',y_test.shape)

    x_train = torch.from_numpy(x_train).type(torch.Tensor)
    y_train_lstm = torch.from_numpy(y_train).type(torch.Tensor)

    x_test = torch.from_numpy(x_test).type(torch.Tensor)
    y_test_lstm = torch.from_numpy(y_test).type(torch.Tensor)

    #input_dim = 1
    #hidden_dim = 16
    #num_layers = 3
    #output_dim = 1
    #num_epochs = 100

    input_dim = 1
    hidden_dim = 32
    num_layers = 2
    output_dim = 1
    num_epochs = 100

    model = LSTM(input_dim=input_dim, hidden_dim=hidden_dim, output_dim=output_dim, num_layers=num_layers)
    criterion = torch.nn.MSELoss(reduction='mean')
    optimiser = torch.optim.Adam(model.parameters(), lr=0.01)

    import time
    hist = np.zeros(num_epochs)
    start_time = time.time()
    lstm = []

    for t in range(num_epochs):
        y_train_pred = model(x_train)

        loss = criterion(y_train_pred, y_train_lstm)
        print("Epoch ", t, "MSE: ", loss.item())
        hist[t] = loss.item()

        optimiser.zero_grad()
        loss.backward()
        optimiser.step()

    training_time = time.time()-start_time
    print("Training time: {}".format(training_time))

    # make predictions
    y_test_pred = model(x_test)

    # invert predictions
    y_train_pred = scaler.inverse_transform(y_train_pred.detach().numpy())
    y_train = scaler.inverse_transform(y_train_lstm.detach().numpy())

    y_test_pred = scaler.inverse_transform(y_test_pred.detach().numpy())
    y_test = scaler.inverse_transform(y_test_lstm.detach().numpy())
    # calculate root mean squared error
    trainScore = math.sqrt(mean_squared_error(y_train[:,0], y_train_pred[:,0]))
    print('Train Score: %.2f RMSE' % (trainScore))
    testScore = math.sqrt(mean_squared_error(y_test[:,0], y_test_pred[:,0]))
    print('Test Score: %.2f RMSE' % (testScore))
    lstm.append(trainScore)
    lstm.append(testScore)
    lstm.append(training_time)

    outputPath=basepath+"/pt_models/"+ symbol+".pt"
    torch.save(model.state_dict(),outputPath )



