from django.contrib.auth.models import User
from users.models import User, DB, Collection
import json
from django.http import HttpResponseNotFound
import re
from static.recipe_shack.buckets import *
from static.recipe_shack.methods import create_response

# Create your views here.
def get_favorites(request):
    username = request.session.get('user')
    if(not username):
        return create_response("No current logged in user!")
    
    user = User.getUserByUsername(username)
    return create_response(data=user.getFavorites())


def add_favorite(request):
    username = request.session.get('user')
    if(not username):
        return create_response("No current logged in user!")
    
    if(request.method == "POST"):
        user = User.getUserByUsername(username)
        data = json.loads(request.body)
        if(user.addFavorite(data["recipe_id"])):
            return create_response()
        return create_response(f"Given recipe is already in {username}'s favorites!")

    return HttpResponseNotFound("<h1>Page not found</h1>")

def remove_favorite(request):
    username = request.session.get('user')
    if(not username):
        return create_response("No current logged in user!")
    
    if(request.method == "POST"):
        user = User.getUserByUsername(username)
        data = json.loads(request.body)
        if(user.removeFavorite(data["recipe_id"])):
            return create_response()
        return create_response(f"Given recipe is not in {username}'s favorites!")

    return HttpResponseNotFound("<h1>Page not found</h1>")

def get_recipes(request):
    username = request.session.get('user')
    if(not username):
        return create_response("No current logged in user!")
    if(request.method == "POST"):
        data = json.loads(request.body)
        if(any(x not in data.keys() for x in ["calories", "cooktime", "rating", "dish", "ingredients"])):
            return create_response("POSTed data is invalid! Please see documentation on how to use this endpoint.")
        
        query = {}
        queryResult = []
        # Find results between [x,y) calories
        # 0 indicates any amount of calories (i.e. do not filter by calories)
        bucket = data["calories"]
        if(bucket != 0):
            query["Calories"] = {"$gte": calorie_buckets[bucket][0], "$lt": calorie_buckets[bucket][1]}

        # Find results between [x, y) cooktime
        # 0 indicates any cooktime (i.e. do not filter by cooktime)
        bucket = data["cooktime"]
        if(bucket != 0):
            query["TotalTime"] = {"$gte": cooktime_buckets[bucket][0], "$lt": cooktime_buckets[bucket][1]}
        
        # Find results with >x rating
        # 0 indicates any rating (i.e. do not filter by rating)
        bucket = data["rating"]
        if(bucket != 0):
            query["Rating"] = {"$gte": bucket}
        
        # Find results of substring search
        if(data["dish"] != ""):
            query["Name"] = {"$regex": re.compile(data["dish"].strip(), re.IGNORECASE)}

        # Find results containing given ingredients
        # The ingredients given must be a superset of the returned recipes
        # That is, for each returned recipe, all ingredients must be in the given ingredient list
        if(data["ingredients"] != []):
            query["Ingredients"] = {"$not": {"$elemMatch": {"$nin": data["ingredients"]}}}
        
        # Only query results if at least one filter was used
        if(query):
            queryResult = list(DB.find(query, Collection.RECIPE, {'_id': 0 }).limit(50))
        return create_response(data=queryResult)
    
    return HttpResponseNotFound("<h1>Page not found</h1>")

    