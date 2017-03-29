from django.core.management.base import BaseCommand, CommandError

from applications.timeseries.services import SeriesLoaderService

class Command(BaseCommand):
    help = 'Load data from csv file'

    def add_arguments(self, parser):
        parser.add_argument('filename', nargs='+', type=str)

    def handle(self, *args, **options):
        for filename in options['filename']:
            print('Processing {filename}'.format(filename=filename))
            service = SeriesLoaderService()
            data = service.read(filename)
            service.load(data)
