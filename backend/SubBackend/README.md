# MyNotion Django backend

## Run the server
This command runs the server on localhost:8000 and reloads the server when you make changes to the code. You might want to restart the server when you add or remove files.
```
python manage.py runserver
```
## Create superuser
```
python manage.py createsuperuser
```

## Migrate database
```
python manage.py migrate
```
## Make migration files
After you make a change to a model, run this command to make a migration file for it.
```
python manage.py makemigrations notion_models
```
Then you can migrate the database with the new migration file

## Create an app
The `notion_models` directory  is the app where we can put the majority of the models for our app. The `notion_auth` directory is where our auth and permissions logic is handled. To create an app directory, run the following command:
```
python manage.py startapp <appName>
```

Then add `appName` to the list of `INSTALLED_APPS` in `settings.py` in the `MyNotionBackend` directory. 

## Graphene

We use [Graphene](https://docs.graphene-python.org/projects/django/en/latest/queries/) as our GraphQL library. It's a bit different from the [Django REST Framework](https://www.django-rest-framework.org/), but it's more powerful and easier to use.