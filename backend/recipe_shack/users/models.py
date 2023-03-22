from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from typing import List
from django import forms
from enum import Enum
import certifi
import pymongo
from django.conf import settings

class Collection(Enum):
    RECIPE = 1
    INGREDIENT = 2
    USER = 3

class DB:
    client = pymongo.MongoClient(settings.DATABASE_URI, tlsCAFile=certifi.where())

    class __Method(Enum):
        FIND = 1
        FIND_ONE = 2
        UPDATE_ONE = 3
        INSERT_ONE = 4

    @classmethod
    def find(cls, query, collection, *args):
        return cls.__send(query, collection, cls.__Method.FIND, *args)
    @classmethod
    def find_one(cls, query, collection, *args):
        return cls.__send(query, collection, cls.__Method.FIND_ONE, *args)
    @classmethod
    def update_one(cls, query, collection, *args):
        return cls.__send(query, collection, cls.__Method.UPDATE_ONE, *args)
    @classmethod
    def insert_one(cls, query, collection, *args):
        return cls.__send(query, collection, cls.__Method.INSERT_ONE, *args)
    
    @classmethod
    def __send(cls, query, collection, method, *args):
        db = cls.client[settings.DATABASE_NAME]
        match collection:
            case Collection.RECIPE:
                collection = db[settings.RECIPE_COLLECTION_NAME]
            case Collection.INGREDIENT:
                collection = db[settings.INGREDIENTS_COLLECTION_NAME]
            case Collection.USER:
                collection = db[settings.USERS_COLLECTION_NAME]
            case _:
                return {}
        match method:
            case cls.__Method.FIND:
                return collection.find(query, *args)
            case cls.__Method.FIND_ONE:
                return collection.find_one(query, *args)
            case cls.__Method.UPDATE_ONE:
                return collection.update_one(query, *args)
            case cls.__Method.INSERT_ONE:
                return collection.insert_one(query, *args)
            case _:
                return {}


# User class which will allow for basic operations on users
class User:
    # Constructor should never be directly called
    # User objects should only be created by class functions
    def __init__(self, data:dict):
        self.__username = data["Username"]
        self.__favorites = data["Favorites"]

    def getUsername(self) -> str:
        return self.__username
    
    def getFavorites(self) -> List[dict]:
        res = list(DB.find({"ID": {"$in": self.__favorites}}, Collection.RECIPE, {'_id': 0 }).limit(20))
        return res
    
    
    def addFavorite(self, recipe) -> bool:
        if recipe not in self.__favorites:
            self.__favorites.append(recipe)
            return self.__save()
        return False

    def removeFavorite(self, recipe) -> bool:
        if(recipe in self.__favorites):
            self.__favorites.remove(recipe)
            return self.__save()
        return False


    def existsInDatabase(self) -> bool:
        return DB.find_one({"Username": self.__username}, Collection.USER)

    def __save(self) -> bool:
        if not self.existsInDatabase():
            return False

        userJSONObject = {
            "Favorites": self.__favorites,
        }
        
        newValues = { "$set": userJSONObject }
        DB.update_one({"Username":self.__username}, Collection.USER, newValues)
        return True
    
    @classmethod
    def createNewUser(cls, username:str, password:str) -> 'User': 
        data = {
            "Username": username,
            "PasswordHash": make_password(password),
            "Favorites": []
        }
        user = User(data)
        if(not user.existsInDatabase()):
            DB.insert_one(data, Collection.USER)
            return user
        return None


    @classmethod
    def authenticateAndRetrieveUser(cls, username:str, password:str) -> 'User':
        user = DB.find_one({"Username": username}, Collection.USER)
        if(user and check_password(password, user["PasswordHash"])):
            return User(user)
        return None

    @classmethod
    def getUserByUsername(cls, username:str) -> 'User':
        return User(DB.find_one({"Username": username}, Collection.USER))

class LoginForm(forms.Form):
    username = forms.CharField(label='username', max_length=25, error_messages={'max_length': "Username is too long"})
    password = forms.CharField(label='password', max_length=25, error_messages={'max_length': "Password is too long"})

