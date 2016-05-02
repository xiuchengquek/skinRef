from django.views.generic import TemplateView
from rest_framework import viewsets, generics
from rest_framework import serializers
from django.shortcuts import HttpResponse
from models import metricsTable, description
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
import django_filters
import json
__author__ = 'quek'


def quickMetrics(request):
    queryset = metricsTable.objects.all()
    results = []
    for x in queryset:
        results.append(
            {'mfc' : x.mfc,
             'cov' : x.cov,
             'hgnc' : x.hgnc,
             'mean' : x.mean}
        )


    result = json.dumps(results)
    return HttpResponse(result)


class metricsSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = metricsTable
        fields = ('mean','cov','hgnc', 'mfc')




class desSerializer(serializers.ModelSerializer):

    class Meta:
        model = description
        fields = ('description','summary', 'gene_name', 'entrezid')

class metricsViewSet(viewsets.ModelViewSet):
    """
    API end point that allow titles to be viewed or edited by default,
    will only return the last 5
    """
    queryset = metricsTable.objects.all()
    serializer_class = metricsSerializer




class desFilter(django_filters.FilterSet):
    class Meta:
        model = description
        fields = ['gene_name']


class desViewSet(viewsets.ViewSet):
    """
    API end point that allow titles to be viewed or edited by default,
    will only return the last 5
    """
    model = description
    serializer_class = desSerializer
    filter_fields = ('gene_name')
    queryset = description.objects.all()

    def list(self, request):
        queryset = description.objects.all()[:5]
        gene_name_value= self.request.query_params.get('gene_name', None)
        if gene_name_value:
            gene_list = gene_name_value.split(',')
            queryset = description.objects.filter(gene_name__in=gene_list)
        serializers=desSerializer(queryset, many=True)
        return Response(serializers.data)




"""
def get_queryset(self):
        queryset = description.objects.all()[:5]
        gene_name_value= self.request.QUERY_PARAMS.get('gene_name', None)
        import sys
        if gene_name_value:
            gene_list = gene_name_value.split(',')
            queryset = description.objects.filter(gene_name__in=gene_list)
            print >> sys.stderr, queryset
        print >> sys.stderr, queryset
        return queryset
"""
class houseView(TemplateView):
    template_name = 'main.html'

class tableView(TemplateView):
    template_name = 'table.html'

