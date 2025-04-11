#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
# rm -rf quora/migrations
# rm -rf db.sqlite3
# ./manage.py makemigrations quora
# ./manage.py migrate
cd transport_simple
cd quora/static_dev/quora
npm i --legacy-peer-deps
npm run build
cd ../../../
python3.13 manage.py collectstatic --no-input
python3.13 manage.py migrate
# echo "from django.contrib.auth import get_user_model; User = get_user_model(); user = User.objects.create_superuser('shivam', '', '123'); from common.models import UserProfile; UserProfile.objects.create(user=user)" | python manage.py shell
