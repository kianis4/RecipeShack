from django.test import TestCase
from django.test import Client
from recipes.views import get_favorites, add_favorite, remove_favorite, get_recipes
from users.models import User
from unittest.mock import patch
import json
from static.recipe_shack.buckets import *

class RecipesViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        username = 'test_user'
        password = 'test_password'
        data = json.dumps({'username': username, 'password': password})
        response = self.client.post('/api/login/', data, content_type='application/json')
        # Checks that login was successful for debugging purposes
        self.assertEqual(response.status_code, 200)

        self.user = User.getUserByUsername(username)
    
    def tearDown(self):
        self.user.removeFavorite(147)

    def test_get_favorites_endpoint_has_items(self):
        # adds a favorite so that it can be retrieved
        self.user.addFavorite(147)

        # calls getfavorites endpoint to get users favorites
        response = self.client.get('/api/getfavorites', {}, True)
        self.assertEqual(response.status_code, 200)

        expectedFavorites = [{'ID': 147, 'Name': 'Campfire Orange Cake', 'TotalTime': 30, 'ImageURL': 'http://4.bp.blogspot.com/-5EoVv2IBiiM/VITFjck7N6I/AAAAAAAAIN8/ccN2Dy6STn8/s1600/IMG_7661.JPG', 'Ingredients': [235], 'Rating': 4.5, 'Calories': 332.5}]
        response = json.loads(response.content.decode('utf-8'))['data']
        self.assertEqual(response, expectedFavorites)


    def test_get_favorites_endpoint_no_items(self):
        response = self.client.get('/api/getfavorites', {}, True)
        self.assertEqual(response.status_code, 200)

        expectedFavorites = []
        response = json.loads(response.content.decode('utf-8'))['data']
        self.assertEqual(response, expectedFavorites)

    def test_add_favorite_endpoint(self):
        # ensures that the user has no favorites
        self.user.removeFavorite(147)

        self.assertEqual(self.user.getFavorites(), [])

        response = self.client.post('/api/addfavorite/', json.dumps({'recipe_id' : 147}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Fetches updated user after adding favorite
        updated_user = User.getUserByUsername(self.user.getUsername())

        expectedFavorites = [{'ID': 147, 'Name': 'Campfire Orange Cake', 'TotalTime': 30, 'ImageURL': 'http://4.bp.blogspot.com/-5EoVv2IBiiM/VITFjck7N6I/AAAAAAAAIN8/ccN2Dy6STn8/s1600/IMG_7661.JPG', 'Ingredients': [235], 'Rating': 4.5, 'Calories': 332.5}]
        self.assertEqual(updated_user.getFavorites(), expectedFavorites)

    def test_remove_favorite(self):
        self.user.addFavorite(147)

        self.assertEqual(self.user.getFavorites(), [{'ID': 147, 'Name': 'Campfire Orange Cake', 'TotalTime': 30, 'ImageURL': 'http://4.bp.blogspot.com/-5EoVv2IBiiM/VITFjck7N6I/AAAAAAAAIN8/ccN2Dy6STn8/s1600/IMG_7661.JPG', 'Ingredients': [235], 'Rating': 4.5, 'Calories': 332.5}])

        response = self.client.post('/api/removefavorite/', json.dumps({'recipe_id' : 147}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Fetches updated user after adding favorite
        updated_user = User.getUserByUsername(self.user.getUsername())

        self.assertEqual(updated_user.getFavorites(), [])

    def test_get_recipes(self):
        data = json.dumps({"calories": 0, "cooktime": 0, "rating": 0, "dish": "Butter Crepes", "ingredients": [129,140,212,63,296]})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        expected_response = [{'ID': 489, 'Name': 'Butter Crepes', 'TotalTime': 71, 'ImageURL': 'https://i.pinimg.com/originals/a6/76/ca/a676cafc045144e6bdf28cd08c1bab60.jpg', 'Ingredients': [129, 140, 212, 63, 296], 'Rating': 1, 'Calories': 116.5}]
        response = json.loads(response.content.decode('utf-8'))['data']
        self.assertEqual(response, expected_response)
        
    def test_get_recipes_no_ingredients(self):
        data = json.dumps({"calories": 0, "cooktime": 0, "rating": 0, "dish": "hasbulla", "ingredients": []})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        expected_response = []
        response = json.loads(response.content.decode('utf-8'))['data']
        self.assertEqual(response, expected_response)

    def test_get_recipes_invalid_postdata(self):
        data = json.dumps({"calories": 0, "cooktime": 0, "ratting": 0, "dish": "", "ingredients": []})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        expected_status = 0
        expected_message = "POSTed data is invalid! Please see documentation on how to use this endpoint."

        response = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response["status"], expected_status)
        self.assertEqual(response["error_message"], expected_message)

    def test_get_recipes_calorie_buckets(self):
        bucket = 3
        data = json.dumps({"calories": bucket, "cooktime": 0, "rating": 0, "dish": "", "ingredients": []})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content.decode('utf-8'))['data']
        low = calorie_buckets[bucket][0]
        high = calorie_buckets[bucket][1]
        for recipe in response:
            self.assertGreaterEqual(recipe["Calories"], low)
            self.assertLess(recipe["Calories"], high)

    def test_get_recipes_cooktime_buckets(self):
        bucket = 1
        data = json.dumps({"calories": 3, "cooktime": bucket, "rating": 0, "dish": "", "ingredients": []})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content.decode('utf-8'))['data']
        low = cooktime_buckets[bucket][0]
        high = cooktime_buckets[bucket][1]
        for recipe in response:
            self.assertGreaterEqual(recipe["TotalTime"], low)
            self.assertLess(recipe["TotalTime"], high)

    def test_get_recipes_rating(self):
        rating = 4
        data = json.dumps({"calories": 3, "cooktime": 1, "rating": rating, "dish": "", "ingredients": []})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content.decode('utf-8'))['data']
        for recipe in response:
            self.assertGreaterEqual(recipe["Rating"], rating)

    def test_get_recipes_ingredient_superset(self):
        ingredients = {129,140,212,63,296}
        data = json.dumps({"calories": 0, "cooktime": 0, "rating": 0, "dish": "", "ingredients": list(ingredients)})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content.decode('utf-8'))['data']
        for recipe in response:
            for ingredient in recipe["Ingredients"]:
                self.assertIn(ingredient, ingredients)
            