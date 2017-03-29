from django.views.generic import TemplateView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Series
from .serializers import EntrySerializer
from .services import MonthlyReturnService


class ChartView(TemplateView):
    """
    Homepage template view
    """
    template_name = 'index.html'


class SeriesDataView(APIView):
    """
    Get data for series
    """

    def get(self, request, *args, **kwargs):
        name = request.query_params.get('series')

        try:
            series = Series.objects.get(name=name)
        except Series.DoesNotExist:
            return Response({'error': 'Series with this name does not exist'}, status=status.HTTP_404_NOT_FOUND)

        entry_serializer = EntrySerializer(series.entries, many=True)
        return Response(entry_serializer.data, status=status.HTTP_200_OK)


class MonthlyReturnsView(APIView):
    """
    Get monthly returns for series
    """

    def get(self, request, *args, **kwargs):
        name = request.query_params.get('series')

        try:
            series = Series.objects.get(name=name)
        except Series.DoesNotExist:
            return Response({'error': 'Series with this name does not exist'}, status=status.HTTP_404_NOT_FOUND)

        result = MonthlyReturnService().process_series(series=series)
        return Response(result, status=status.HTTP_200_OK)
