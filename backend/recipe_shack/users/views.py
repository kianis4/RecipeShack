from django.contrib.auth.forms import UserCreationForm
from .models import User, LoginForm
from django.http import HttpResponseNotFound
from static.recipe_shack.methods import create_response
import json
# Index page
# If user is logged in then show them the index screen
# If not, show redirect them to login page
def getSession(request):
    username = request.session.get('user')
    if(username):
        return create_response(data=username)
    return create_response("No User Session Found!")


# Register Page
# Attempt to create a new user with given credentials
# Currently just reloads the page on fail
# On success, saves login session and redirects to index
def register(request):
    if request.method == 'POST':
        if(request.session.get('user', None)):
            return create_response("User already logged in!")
        
        data = json.loads(request.body)
        form = UserCreationForm(data)
        if(form.is_valid()):
            data = form.cleaned_data
            user = User.createNewUser(data['username'], data['password1'])
            if(user):
                request.session['user'] = user.getUsername()
                request.session.modified = True
                return create_response()

            else:
                return create_response("A user already exists with that username!")
        else:
            return create_response(next(iter(form.errors.values()))[0])

    return HttpResponseNotFound("<h1>Page not found</h1>")


# Register Page
# Attempt to authenticate user with given credentials
# Currently just reloads the page on fail
# On success, saves login session and redirects to index
def login(request):
    if request.method == 'POST':
        if(request.session.get('user', None)):
            return create_response()
        
        data = json.loads(request.body)
        form = LoginForm(data)
        if(form.is_valid()):
            data = form.cleaned_data
            user = User.authenticateAndRetrieveUser(data['username'], data['password'])
            if(user):
                request.session['user'] = user.getUsername()
                request.session.modified = True
                return create_response()
            else:
                return create_response("Invalid Username or password")
        else:
            return create_response(next(iter(form.errors.values()))[0])
        
    return HttpResponseNotFound("<h1>Page not found</h1>")

# Logout
# Has no visible page, simply sets login session to None
# Redirects to home which will redirect to login page
def logout(request):
    if request.method == 'POST':
        request.session['user'] = None
        request.session.modified = True
        return create_response()
    return HttpResponseNotFound("<h1>Page not found</h1>")


