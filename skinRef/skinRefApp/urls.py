#!/usr/bin/env python



__author__ = 'quek'
from django.conf.urls import include, url
from views import metricsViewSet, desViewSet, houseView, tableView, quickMetrics
from rest_framework import routers



router = routers.DefaultRouter(trailing_slash=False)
router.register(r'metrics/$', metricsViewSet)

router.register(r'description/', desViewSet)

urlpatterns = [
	url(r'^$', houseView.as_view()),
	url(r'^table', tableView.as_view()),
	url(r'^rest/', include(router.urls)),
	url(r'^quick/', quickMetrics)

]



