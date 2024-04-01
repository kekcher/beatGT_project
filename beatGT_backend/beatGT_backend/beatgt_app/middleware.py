from django.conf import settings
from django.http import JsonResponse
from beatgt_app.crypto import decode_token, create_token
from beatgt_app.models import BeatGtUser
from beatgt_app.serializers import BeatGtUserSerializer
import jwt
from datetime import datetime

class JwtToken:
    def __init__(self, get_response):
        self.get_response = get_response
        self.excluded_paths = ['/auth_user/',
                               '/registration/',
                               '/component/',
                               '/assembly/',
                               '/test/',
                               '/count_stats/',
                               '/get_assemblies/',
                               '/get_filter_component/',
                               '/create_component/']

    def __call__(self, request):

        if('/admin' in request.path):
            return self.get_response(request)

        # Если это роуты, которые не нужно проверять на валидность токена
        if request.path in self.excluded_paths:
            return self.get_response(request)

        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if not auth_header:
            return JsonResponse({'error': 'Пользователь не авторизован!'}, status=401)

        #Получаем токен
        token = auth_header.replace('Bearer ', '')

        #Получаем из него payload
        try:
            payload = decode_token(token)

            #Проверяем, что есть такой пользователь
            user = BeatGtUser.objects.filter(login=payload['login'])
            user_serializer = BeatGtUserSerializer(user, many=True)

            if not len(user):
                return JsonResponse({'error': 'Пользователь не авторизован!'}, status=401)

            #Теперь будем проверять токен на истечение срока
            current_date = datetime.now()
            current_days = (current_date - datetime.strptime(user_serializer.data[0]['last_login'], '%Y-%m-%dT%H:%M:%S.%fZ')).days

            if current_days > 1:
                payload = {
                    'login': payload['login'],
                    'last_login': current_date.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                }

                # Обновляем токен
                new_token = create_token(payload)
                BeatGtUser.objects.filter(login=payload['login']).update(last_login=payload['last_login'])

                response = self.get_response(request)
                response['x-auth-token'] = new_token
                return response
            elif current_days > 7:
                return JsonResponse({'error': 'Токен просрочен!'}, status=401)

            return self.get_response(request)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)






