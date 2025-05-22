from fastapi import APIRouter
from app.services.mongo import get_vector_collection
from collections import Counter
import re

router = APIRouter()

# Common English stopwords
STOPWORDS = set("""
a about above after again against all am an and any are aren't as at be because been before being
below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down
during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her
here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's
its itself let's me more most mustn't my myself no nor not of off on once only or other ought our
ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than
that that's the their theirs them themselves then there there's these they they'd they'll they're
they've this those through to too under until up very was wasn't we we'd we'll we're we've were
weren't what what's when when's where where's which while who who's whom why why's with won't would
wouldn't you you'd you'll you're you've your yours yourself yourselves
""".split())

def clean_and_tokenize(text):
    # Basic word tokenizer and cleaner
    words = re.findall(r'\b\w+\b', text.lower())
    return [word for word in words if word not in STOPWORDS and len(word) > 2]

@router.get("/wordcloud")
def get_wordcloud():
    collection = get_vector_collection()
    cursor = collection.find({}, {"text": 1, "_id": 0})

    all_words = []
    for doc in cursor:
        if "text" in doc:
            all_words.extend(clean_and_tokenize(doc["text"]))

    # Count and take top 100 words
    counter = Counter(all_words)
    most_common = counter.most_common(100)
    return [{"text": word, "value": count} for word, count in most_common]