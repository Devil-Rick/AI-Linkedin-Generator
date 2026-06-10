import spacy
from yake import KeywordExtractor
from textblob import TextBlob

nlp = spacy.load('en_core_web_sm')
kw_extractor = KeywordExtractor()

#getting entities from input data
def get_entity(text):
    doc = nlp(text)
    
    return [
        ent.text for ent in doc.ents
    ]
    
# retrieve useful nouns
def get_nouns(text):
    doc = nlp(text)
    
    return [
        noun.text
        for noun in doc.noun_chunks
    ]    
    
# get keywords from the text 

def get_keywords(text):
    
    keywords = kw_extractor.extract_keywords(text)
    
    return [k[0] for k in keywords[:5]]


# get the sentiment of the statemnt

def get_sentiment(text):
    polarity = TextBlob(text).sentiment.polarity
    
    if polarity > 0 :
        return 'Positive'
    if polarity < 0 :
        return 'Negative'
    
    return 'Neutral'



# main analysis function
def analyze_text(text):
    entity = get_entity(text)
    noun = get_nouns(text)
    keywords = get_keywords(text)
    sentiment = get_sentiment(text)
    
    return{
        'Entity' : entity,
        'Nouns' : noun,
        'Keywords' : keywords,
        'Sentiment' : sentiment
    }
