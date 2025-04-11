## Requirements  (Prerequisites)
Tools and packages required to successfully install this project.
* Linux
* Python 3.13
* Node 20.14.0

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

### Go to folder
```
cd transport_simple
```

### Make migrations and migrate
```
python manage.py makemigrations
python manage.py migrate
```

### Create a superuser
```
python manage.py createsuperuser
```

## Set Up Front-end
### Go to front-end folder
```
cd quora/static_dev/quora
```

### Install packages
```
npm i --legacy-peer-deps
```
### Run Build
```
npm run build
```
### Come back to Django directory
```
cd ../../../
```

## Run the server
```
python manage.py runserver
```

## Tech Stack / Built With
* [Django](https://www.djangoproject.com/) - The Python framework
* [React](https://www.react.dev/) - The library for web and native user interfaces
