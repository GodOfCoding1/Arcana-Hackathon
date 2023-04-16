from .views import CSVView
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'csv', CSVView, basename='Toggle spool status')

urlpatterns = [
    path(r'', include(router.urls)),
]