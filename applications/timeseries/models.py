from django.db import models


class Series(models.Model):
    """
    Keep track of different series
    """

    name = models.CharField(max_length=50)

    def __str__(self):
        return 'Series <{}>'.format(self.name)


class Entry(models.Model):
    """
    Stores time-series entry for a specific date
    """

    date = models.DateField()
    value = models.FloatField()

    series = models.ForeignKey(Series, related_name='entries')

    def __str__(self):
        return 'Entry <{} | {}>'.format(self.date, self.value)
