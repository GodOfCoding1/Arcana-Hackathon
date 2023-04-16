# importing libraries
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import os
import json
nltk.download('punkt')
nltk.download('stopwords')

#defining paths
BasePath = ".\\"
Transcript_Path = BasePath + "fmp-transcripts\\FMP"
Preprocess_store_Path = BasePath + "fmp-transcripts-Summarized\\FMP"

# Defining StopWords for the text
stopWords = set(stopwords.words("english"))
for i in ["yeah","yes","no","thank","please","go","ahead"]:
    stopWords.add(i)

#Defining the function to Summarize the text
def summarize(text):
    #Code to remove Speaker from Transcript
    TempText = ""
    flag=1
    for ch in text:
        if flag:
            TempText = TempText + ch
        if ch == ':':
            flag = 1
        elif ch == '\n':
            flag = 0
    text = TempText
    #Code to remove sentences with less than 4 words
    TempText = ""
    sentences = sent_tokenize(text)
    for sentence in sentences:
        if len(sentence.split())>3:
            TempText += " " + sentence
    text = TempText
    #resumarizing 3 times or till the text has not less than 75 words 
    for i in range(3):
        if len(text.split()) >= 75:
            words = word_tokenize(text)

            # Creating a frequency table to keep the 
            # score of each word 
            freqTable = dict()
            for word in words:
                word = word.lower()
                if word in stopWords:
                    continue
                if word in freqTable:
                    freqTable[word] += 1
                else:
                    freqTable[word] = 1
           
            # Creating a dictionary to keep the score
            # of each sentence
            sentences = sent_tokenize(text)
            sentenceValue = dict()
            for sentence in sentences:
                for word, freq in freqTable.items():
                    if word in sentence.lower():
                        if sentence in sentenceValue:
                            sentenceValue[sentence] += freq
                        else:
                            sentenceValue[sentence] = freq
            
            sumValues = 0
            for sentence in sentenceValue:
                sumValues += sentenceValue[sentence]
            
            # Average value of a sentence from the original text
            
            average = int(sumValues / len(sentenceValue))
            
            # Storing sentences into our summary.
            summary = ''
            for sentence in sentences:
                if (sentence in sentenceValue) and (sentenceValue[sentence] > (1.2* average)):
                        summary += " " + sentence
            text = summary

            if (len(summary.split()) >= 75):
                TempText=summary
    
    return TempText

for dirname, _, filenames in os.walk(Transcript_Path):
    for filename in filenames: 
        if ".json" in filename:
            filePath = os.path.join(dirname, filename).replace("\\","/")
            with open(filePath, 'r') as f:
                data = json.load(f)
            
            text = data['content']
            data['content'] = summarize(text)
            Tr_path_length = len(Transcript_Path)

            new_file_dir = Preprocess_store_Path + dirname[Tr_path_length:]
            new_filePath = Preprocess_store_Path + dirname[Tr_path_length:]+"\\"+ filename
            
            # Check whether the specified path exists or not, and if not create path
            if not os.path.exists(new_file_dir):
                os.makedirs(new_file_dir)
            
            with open(new_filePath, 'w') as f:
                json.dump(data, f, indent=4)
        