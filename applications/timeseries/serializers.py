from rest_framework import serializers
from .models import Entry


class EntrySerializer(serializers.ModelSerializer):
    """
    Prepare entry data for API response
    """

    value = serializers.DecimalField(decimal_places=6, max_digits=10)

    class Meta:
        model = Entry
        fields = ('date', 'value')
