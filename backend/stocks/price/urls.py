from .views import CSVView,Predict,CheckModel
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'csv', CSVView, basename='csv')
router.register(r'predict', Predict, basename='prediction')
router.register(r'checkModel', CheckModel, basename='checking model')

urlpatterns = [
    path(r'', include(router.urls)),
]