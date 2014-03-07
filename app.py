import os
import requests
import json
from flask import Flask, request, render_template, redirect, abort, flash, jsonify
app = Flask(__name__)   # create our flask app

@app.route("/",methods=['GET','POST'])
def display_tweets():
	return render_template("sentAnalysis.html")

@app.route("/sentiment", methods=['GET', 'POST'])
def sentiment():
	sentiDataJson = []
	if request.method == ('GET'):
		print ("getting")
		newArticles = request.args.get('theText')
		url = 'http://text-processing.com/api/sentiment/'
		words = requests.post(url, {'text': newArticles})
		sentiData = words.json()
		# print sentiDataJson
		# print ("words =")
		# print words
		# print ("words.json() =")
		# print sentiData
		print ("probability")
		print sentiData.get('probability')
		print ("label")
		print sentiData.get('label')
		
		return jsonify(sentiData)
	else:
		return render_template("sentAnalysis.html")

	# --------- Server On ----------
# start the webserver
if __name__ == "__main__":
	app.debug = True
	
	port = int(os.environ.get('PORT', 5000)) # locally PORT 8000
	app.run(host='0.0.0.0', port=port)


