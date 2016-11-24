from datetime import timedelta

config = [
        {
            'class': 'FileExistenceMonitor',
            'params': (['/tmp/*'],),
            'attributes': {
                'name': 'Temp Files',
                'source': 'Local Computer',
                'description': 'Files that create all the time',
                'arrival_interval': timedelta(seconds=125),
                'is_active': True,
                'group_name': 'Most Important',
                'notes': 'Your should monitor this'
            }
        },
        {
            'class': 'LogLinesMonitor',
            'params': (['/tmp/$DATE/waka*.txt'], [('quack', 'Good a duck was here'), ('meow', 'Bad a cat was here')],),
            'attributes': {
                'name': 'Waka log file',
                'source': 'Local Computer',
                'description': 'Crazy log file',
                'arrival_interval': timedelta(seconds=90),
                'is_active': True,
                'group_name': 'Most Important',
            }
        },
        {
            'class': 'FileExistenceMonitor',
            'params': (['/var/log/*'],),
            'attributes': {
                'name': '/var/log files',
                'source': 'Local Computer',
                'description': 'Log files',
                'arrival_interval': timedelta(seconds=120),
                'is_active': True,
                'group_name': 'Logs Sections',
            }
        },
        {
            'class': 'FileExistenceMonitor',
            'params': (['/home/oz/*'],),
            'attributes': {
                'name': '/home/oz files',
                'source': 'Local Computer',
                'description': 'Home files',
                'arrival_interval': timedelta(days=1, seconds=360),
                'is_active': False,
                'group_name': 'Logs Sections',
            }
        },
]
