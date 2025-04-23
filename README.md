# RecipeShack - Full Stack Recipe Search & Management Application

![Recipe Shack](https://img.shields.io/badge/Recipe-Shack-teal)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Django](https://img.shields.io/badge/Backend-Django-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 📋 Project Overview

RecipeShack is a comprehensive full-stack web application that allows users to search for recipes based on ingredients, filter by various parameters, and save their favorite recipes. The application features a modern, responsive UI built with React and Chakra UI on the frontend, with a robust Django backend connected to a MongoDB database.

## 🚀 Key Features

- **User Authentication System**: Secure login/signup with session management
- **Advanced Recipe Search**: Filter recipes by ingredients, calories, cooking time, and ratings
- **Ingredient Selection**: Auto-completing ingredient picker with a database of 300+ ingredients
- **Favorites Management**: Save, view, and remove favorite recipes
- **Responsive UI**: Modern interface built with Chakra UI components

## 🛠️ Technology Stack

### Frontend
- **React**: Component-based UI with React Hooks for state management
- **Chakra UI**: Component library for building accessible and responsive interfaces
- **React Router**: Client-side routing
- **Axios**: Promise-based HTTP client for API requests
- **JS-Cookie**: Cookie handling for CSRF tokens
- **Jest & React Testing Library**: Component and integration testing

### Backend
- **Django**: Python web framework for robust backend development
- **MongoDB**: NoSQL database for flexible data storage
- **PyMongo**: MongoDB driver for Python
- **Django REST Framework**: Building RESTful APIs
- **Django CORS Headers**: Cross-Origin Resource Sharing support
- **Certifi**: Certificate validation for secure connections

## 🏗️ System Architecture

### Frontend Architecture

The frontend follows a modern React architecture with functional components and hooks:

```jsx
const RecipeSearch = ({ ingredients }) => {
  const [dish, setDish] = useState("");
  const [appliedCalories, setAppliedCalories] = useState(0);
  const [appliedCookTime, setAppliedCookTime] = useState(0);
  const [appliedRating, setAppliedRating] = useState(0);
  const [myData, setMyData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const request = {
      dish: dish,
      ingredients: ingredients,
      calories: appliedCalories,
      cooktime: appliedCookTime,
      rating: appliedRating,
    };
    axios.post("/api/getrecipes/", request, postRequestConf).then((res) => {
      setMyData(res.data.data);
    });
    // ...
  }, [ingredients, appliedCalories, appliedCookTime, appliedRating, dish]);
  
  // Component rendering...
}
```

### Backend Architecture

The backend implements a custom user authentication system and RESTful API endpoints:

```python
def get_recipes(request):
    username = request.session.get('user')
    if(not username):
        return create_response("No current logged in user!")
    if(request.method == "POST"):
        data = json.loads(request.body)
        
        # Validate request data
        if(any(x not in data.keys() for x in ["calories", "cooktime", "rating", "dish", "ingredients"])):
            return create_response("POSTed data is invalid! Please see documentation on how to use this endpoint.")
        
        query = {}
        queryResult = []
        
        # Apply filters based on request parameters
        bucket = data["calories"]
        if(bucket != 0):
            query["Calories"] = {"$gte": calorie_buckets[bucket][0], "$lt": calorie_buckets[bucket][1]}
        
        # Additional filtering logic...
        
        # Execute MongoDB query with filters
        if(query):
            queryResult = list(DB.find(query, Collection.RECIPE, {'_id': 0 }).limit(50))
        return create_response(data=queryResult)
```

### Database Structure

The application uses MongoDB collections for:
- **Users**: User authentication and profile information
- **Recipes**: Recipe details including ingredients, cooking time, calories
- **Favorites**: User-recipe relationships for saved favorites

## 📱 Key Components

### Authentication Flow

The authentication system implements secure login/signup with session management:

```javascript
// SignupPage component
const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    axios.get("/api/getsession/").then((res) => {
      if (res.data.status) {
        window.location.href = "/homepage";
      }
    });
  }, []);
  
  // Registration submission handler
  const handleSignup = () => {
    axios.post(
      "/api/register/",
      {
        username: username,
        password1: password,
        password2: confirmPassword,
      },
      postRequestConf
    ).then((res) => {
      if (res.data.status) {
        window.location.href = "/homepage";
      } else {
        setSignupError(res.data.error_message);
      }
    });
  }
}
```

### Ingredient Search

The ingredient search component utilizes Chakra UI's autocomplete functionality:

```javascript
const IngredientsSearch = ({ callback }) => {
  const [ingredients, setIngredients] = useState([]);
  const pickerItems = myIngredients;

  const handleSelectedItemsChange = (ingredients) => {
    if (ingredients) {
      setIngredients(ingredients);
    }
  };

  useEffect(() => {
    const ingredientValues = ingredients.map((ingredient) => ingredient.value);
    callback(ingredientValues);
  }, [ingredients]);
  
  // Component rendering...
}
```

### Filter Modals

The application implements modal filters for calories, cooking time, and ratings:

```javascript
function CaloriesModal({callback}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [bgColor, setBgColor] = useState("white");
  const [selectedCalories, setSelectedCalories] = useState(0);
  const [appliedCalories, setAppliedCalories] = useState(0);

  useEffect(() => {
    callback(appliedCalories);
  }, [appliedCalories]);

  const handleApply = () => {
    setAppliedCalories(selectedCalories);
    onClose();
    if (selectedCalories) {
      setBgColor("teal");
    }
  };
  
  // Modal UI rendering...
}
```

## 🧪 Testing Strategy

The project features comprehensive testing for both frontend and backend:

### Frontend Testing

Using Jest and React Testing Library for component tests:

```javascript
describe('RecipeSearch', () => {
  const defaultProps = {
    ingredients: [],
  };

  beforeEach(() => {
    axios.post.mockResolvedValue({ data: { data: [] } });
    axios.get.mockResolvedValue({ data: { data: [] } });
  });

  it('renders RecipeSearch with input field, search button, and filter modals', () => {
    render(<RecipeSearch {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter dish name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /apply/i })).toHaveLength(3);
  });
  
  // Additional tests...
});
```

### Backend Testing

Using Django TestCase for API endpoint testing:

```python
class RecipesViewsTest(TestCase):
    def setUp(self):
        self.client = Client()
        username = 'test_user'
        password = 'test_password'
        data = json.dumps({'username': username, 'password': password})
        response = self.client.post('/api/login/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.user = User.getUserByUsername(username)
    
    def test_get_recipes(self):
        data = json.dumps({"calories": 0, "cooktime": 0, "rating": 0, "dish": "Butter Crepes", "ingredients": [129,140,212,63,296]})
        response = self.client.post('/api/getrecipes/', data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        expected_response = [{'ID': 489, 'Name': 'Butter Crepes', 'TotalTime': 71, 'ImageURL': 'https://i.pinimg.com/originals/a6/76/ca/a676cafc045144e6bdf28cd08c1bab60.jpg', 'Ingredients': [129, 140, 212, 63, 296], 'Rating': 1, 'Calories': 116.5}]
        response = json.loads(response.content.decode('utf-8'))['data']
        self.assertEqual(response, expected_response)
    
    # Additional tests...
```

## 🔐 Security Considerations

The application implements several security best practices:

- **CSRF Protection**: Using Django's built-in CSRF middleware and tokens
- **Secure Password Handling**: Passwords are hashed using Django's authentication system
- **Session Management**: Server-side session validation
- **Input Validation**: Thorough validation of user inputs

## 🌟 Advanced Features

### Custom MongoDB Integration

The application implements a custom MongoDB connector with Python's pymongo:

```python
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
    
    # Other database methods...
    
    @classmethod
    def __send(cls, query, collection, method, *args):
        db = cls.client[settings.DATABASE_NAME]
        # Collection selection logic
        match collection:
            case Collection.RECIPE:
                collection = db[settings.RECIPE_COLLECTION_NAME]
            # Other collections...
            
        # Method execution logic
        match method:
            case cls.__Method.FIND:
                return collection.find(query, *args)
            # Other methods...
```

### Custom User Authentication

The backend implements a custom user model and authentication system:

```python
class User:
    def __init__(self, data:dict):
        self.__username = data["Username"]
        self.__favorites = data["Favorites"]

    def getUsername(self) -> str:
        return self.__username
    
    # User methods...
    
    @classmethod
    def authenticateAndRetrieveUser(cls, username:str, password:str) -> 'User':
        user = DB.find_one({"Username": username}, Collection.USER)
        if(user and check_password(password, user["PasswordHash"])):
            return User(user)
        return None
```

## 🛣️ API Routes

The application exposes the following API endpoints:

- **User Authentication**:
  - POST `/api/login/` - User login
  - POST `/api/register/` - User registration
  - POST `/api/logout/` - User logout
  - GET `/api/getsession/` - Check session status

- **Recipe Operations**:
  - POST `/api/getrecipes/` - Search for recipes with filters
  - GET `/api/getfavorites/` - Get user's favorite recipes
  - POST `/api/addfavorite/` - Add recipe to favorites
  - POST `/api/removefavorite/` - Remove recipe from favorites

## 🔮 Future Enhancements

- Mobile application using React Native
- Enhanced recipe recommendation using machine learning
- Social features for sharing favorite recipes
- Advanced filtering options (dietary restrictions, cuisine types)
- Real-time collaborative meal planning

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python 3.8+
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/RecipeShack.git
   cd RecipeShack
   ```

2. Set up the backend:
   ```bash
   cd backend/recipe_shack
   pip install -r requirements.txt
   python manage.py runserver
   ```

3. Set up the frontend:
   ```bash
   cd frontend/recipe-shack
   npm install
   npm start
   ```

## 👥 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
