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
        }
]
