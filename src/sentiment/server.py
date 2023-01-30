from flask import Flask, jsonify, request
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
nltk.download('wordnet')
nltk.download('omw-1.4')
from nltk.stem import PorterStemmer, WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
import joblib
import base64


text_regex = r'''[a-zA-Z0-9]+'[a-zA-Z0-9]+|[a-zA-Z0-9]+'''
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
stemmer_cache = {}
STOP_WORDS = set(stopwords.words('english'))
STOP_WORDS.remove('not')
cv = joblib.load('cv.pkl')
model = joblib.load('my_model.pkl')

def process_token(t: str) -> str:
    """
    Small helper to stem individual tokens (either get from cache or
    stem and add to cache)
    :param t: Token to process
    :return: Stemmed token
    """
    if t in stemmer_cache:
        return stemmer_cache[t]
    else:
        temp = lemmatizer.lemmatize(t)
        temp = stemmer.stem(temp.lower())
        stemmer_cache[t] = temp
        return temp

app = Flask(__name__)
@app.route("/w/<user_input>")
def semantic_score(user_input:str):
    user_input = base64.b64decode(user_input)
    user_input = user_input.decode()
    u = user_input.lower()
    tokens = re.findall(text_regex, u)
    tokens = [process_token(token) for token in tokens if token not in STOP_WORDS]
    clean_data = ' '.join(tokens)
    u_corpus = [clean_data]
    u_X_test = cv.transform(u_corpus).toarray()
    u_pred = model.predict_proba(u_X_test)

    print(u_pred)
    ans = {"sentiment": str(u_pred[0][1])}

    response = jsonify(ans)
    response.headers.add("Access-Control-Allow-Origin", '*')
    return response