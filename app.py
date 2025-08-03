from flask import Flask, render_template, request, jsonify
import json
import nltk
import random
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)

# Load JSON data from the file
with open("main.json", "r") as json_file:
    data = json.load(json_file)

# Extract intents
intents = data["intents"]

# Preprocess patterns and store them in a dictionary with intent tags
processed_patterns = {}
for intent in intents:
    intent_tag = intent["tag"]
    patterns = intent["patterns"]
    processed_patterns[intent_tag] = [pattern.lower() for pattern in patterns]

# Initialize Context
current_context = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    user_input = request.json['user_message'].lower()

    best_match_score = 0
    best_match_response = "I'm sorry, I don't understand."

    for intent in intents:
        intent_tag = intent["tag"]
        patterns = processed_patterns[intent_tag]

        # Calculate cosine similarity between user input and each pattern
        vectorizer = CountVectorizer().fit_transform([user_input] + patterns)
        vectors = vectorizer.toarray()
        similarity_scores = cosine_similarity(vectors)

        # The first score is the similarity between user input and itself
        # Find the maximum similarity score among the patterns
        max_score = max(similarity_scores[0][1:])

        if max_score > best_match_score:
            best_match_score = max_score
            best_match_response = random.choice(intent["responses"])
            if intent["context_set"]:
                current_context = intent["context_set"]

    return jsonify({'bot_response': best_match_response})

if __name__ == '__main__':
    app.run(debug=True)
