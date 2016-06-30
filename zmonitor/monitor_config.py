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
            'arrival_interval': timedelta(seconds=60),
            'is_active': True,
            'monitor': 'LogLinesMonitor',
            'monitor_params': (['/tmp/$DATE/waka*.txt'], [('quack', 'Good a duck was here'), ('meow', 'Bad a cat was here')],)
        },
        {
            'name': '/var/log files',
            'source': 'Local Computer',
            'description': 'Log files',
            'arrival_interval': timedelta(seconds=120),
            'is_active': True,
            'monitor': 'FileExistenceMonitor',
            'monitor_params': (['/var/log/*'],)
        },
        {
            'name': '/home/oz files',
            'source': 'Local Computer',
            'description': 'Home files',
            'arrival_interval': timedelta(days=1),
            'is_active': True,
            'monitor': 'FileExistenceMonitor',
            'monitor_params': (['/home/oz/*'],)
        },
]
