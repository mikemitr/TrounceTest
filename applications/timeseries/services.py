import csv
from itertools import groupby

from .models import Series, Entry


class SeriesLoaderService(object):
    """
    Load data from csv file into time series models
    """

    DATE_COLUMN = 'Date'

    def read(self, filename):
        """
        Read data from csv-file, and store each column in dict
        """
        with open(filename, newline='\n') as csv_file:
            return self._read_file(csv_file)

    @staticmethod
    def _read_file(csv_file):
        series_reader = csv.reader(csv_file, delimiter=',')
        headers = series_reader.__next__()
        series_data = {name: [] for name in headers}
        for row in series_reader:
            for header, value in zip(headers, row):
                series_data[header].append(value)
        return series_data

    def load(self, data):
        """
        Load processed data into DB
        """
        for column in data.keys():
            if column == self.DATE_COLUMN:
                continue
            self._process_column(data=data, column=column)

    def _process_column(self, data, column):
        print('Process <{column}>'.format(column=column))
        series, _ = Series.objects.get_or_create(name=column)
        entries = []
        for date, value in zip(data[self.DATE_COLUMN], data[column]):
            if value:
                entries.append(Entry(date=date, value=float(value), series=series))
        Entry.objects.bulk_create(entries)


class MonthlyReturnService(object):
    """
    Helps to calculate monthly revenue
    """

    def process_series(self, series):
        entries = series.entries.all().order_by('date')

        result = []
        previous_value = None
        for key, group in groupby(entries, lambda x: (x.date.month, x.date.year)):
            data, previous_value = self._process_month(group, previous_value)
            if data:
                result.append(data)
        return result

    def _process_month(self, group, previous_value):
        last_in_month = list(group)[-1]
        data = None
        if previous_value:
            data = {
                'date': '{}-{}'.format(last_in_month.date.year, last_in_month.date.month),
                'value': self._calculate_monthly_return(
                    current_value=last_in_month.value,
                    previous_value=previous_value
                )
            }
        return data, last_in_month.value

    @staticmethod
    def _calculate_monthly_return(current_value, previous_value):
        """
        Monthly Return (%) (January 2017) = (Value (31-Jan-2017) - Value (31-Dec-2016)) / Value (31-Dec-2016)
        """
        return (current_value - previous_value) / previous_value
