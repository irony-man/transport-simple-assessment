## Requirements  (Prerequisites)
Tools and packages required to successfully install this project.
* Linux
* Python 3.13
* Postgres 14

## Local Run Setup
Clone the repo and run the following commands:
### Create a virtual environment
```
python3 -m venv .venv
source .venv/bin/activate
```

### Install dependencies
```
pip install -r requirements.txt
```

### Set up env variables
```
cat .env.template > .env
```
Add your variables to .env file

### Make migrations and migrate
```
python manage.py makemigrations
python manage.py migrate
```

### Create a superuser
```
python manage.py createsuperuser
```

### Run the server
```
python manage.py runserver
```

## Tech Stack / Built With
* [Django](https://www.djangoproject.com/) - The Python framework
* [React](https://www.react.dev/) - The library for web and native user interfaces
