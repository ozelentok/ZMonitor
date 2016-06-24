from abc import ABC, abstractmethod
import glob
import os
from datetime import datetime

class BaseMonitor(ABC):

    def __init__(self, name):
        self.name = name
        self.status = ''

    @abstractmethod
    def check(self):
        pass

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        self._name = value

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        self._status = value

class FileExistenceMonitor(BaseMonitor):
    '''
    Monitor for file existence and creation
    Args:
        name (str): Monitor name
        glob_patterns (list): glob file paths to search
    '''

    def __init__(self, name, glob_patterns):
        super().__init__(name)
        self._glob_patterns = glob_patterns
        self.last_file_path = None

    @property
    def last_file_path(self):
        return self._last_file_path

    @last_file_path.setter
    def last_file_path(self, value):
        self._last_file_path = value

    def generate_current_glob_patterns(self):
        DATE_FORMAT = '%Y%m%d'
        DATE_SYMBOL = '$DATE'
        return [pattern.replace(DATE_SYMBOL,
            datetime.now().strftime(DATE_FORMAT))
            for pattern in self._glob_patterns]

    def get_newest_file_paths(self):
        files_found = []
        for glob_pattern in self.generate_current_glob_patterns():
            files_found += glob.glob(glob_pattern)
        files_found.sort(key=os.path.getmtime)
        return files_found

    def check(self):
        files_found = self.get_newest_file_paths()
        if len(files_found) == 0:
            return False
        if files_found[-1] == self.last_file_path:
            return False
        self.last_file_path = files_found[-1]
        self.status = 'Last File: {}'.format(self.last_file_path)
        return True

class LogLinesMonitor(FileExistenceMonitor):
    '''
    Monitor for log lines in log files
    Args:
        name (str): Monitor name
        glob_patterns (list): glob file paths to search
        lines_meanings (list): pairs of text to search in each line and the meaning of it if found
    '''

    def __init__(self, name, glob_patterns, lines_meanings):
        super().__init__(name, glob_patterns)
        self._lines_meanings = lines_meanings
        self._current_log_path = None

    def check(self):
        files_found = self.get_newest_file_paths()
        if len(files_found) == 0:
            return False
        if files_found[-1] != self.last_file_path:
            self._lines_read = 0
            self.last_file_path = files_found[-1]

        was_updated = False
        with open(self.last_file_path, 'r') as log_file:
            for line_num, line in enumerate(log_file):
                if line_num < self._lines_read:
                    continue
                for line_meaning in self._lines_meanings:
                    if line_meaning[0] in line:
                        was_updated = True
                        self.status = line_meaning[1]
            self._lines_read = line_num + 1
        return was_updated
