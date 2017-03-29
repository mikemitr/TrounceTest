# Trounceflow Test Task

## Setting up

1. Set up virtualenv and install requirements from `requirements.txt`
2. Command to perform initial data loading into database
`./manage.py load_timeseries csv_file.csv`
3. Run server

## API

`/api/series/` - Get data for series
Params:
series - series name

`/api/series/monthly_return/` - Get monthly returns for series
Params:
series - series name

## Tasks 1 and 2

Initial data is loaded into db using SeriesLoaderService (`/applications/timeseries/services.py`)
Data loaded by doing API call with series name (see `/static/main.js` - loadData function)

## Task 3

See `/static/main.js` - rescale function

## Tasks 4 and 5

Backend - API endpoint uses MonthlyReturnService to help with value calculation `/applications/timeseries/services.py`
Frontend - see `/static/main.js` - monthlyReturn function
