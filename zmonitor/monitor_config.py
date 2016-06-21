from datetime import timedelta

config = [
        {
            'name': 'Temp Files',
            'source': 'Local Computer',
            'description': 'Files that create all the time',
            'arrival_interval': timedelta(seconds=120),
            'is_active': True,
            'monitor': 'FileExistenceMonitor',
            'monitor_params': (['/tmp/*'],)
        },
        {
            'name': 'Waka log file',
            'source': 'Local Computer',
            'description': 'Crazy log file',
            'arrival_interval': timedelta(seconds=20),
            'is_active': True,
            'monitor': 'LogLinesMonitor',
            'monitor_params': (['/tmp/waka*.txt'], [('quack', 'Good a duck was here'), ('meow', 'Bad a cat was here')],)
        }
]
